import os
import sys
import json
import argparse
from datetime import datetime, timezone
from bson import ObjectId
from pymongo import MongoClient
from dotenv import load_dotenv

# Path to .env.rocket script configuration
ENV_FILE = os.path.join(os.path.dirname(__file__), '.env.rocket')

def load_config(env_path=ENV_FILE):
    """Load environment variables from the specified .env file."""
    load_dotenv(env_path, override=True)
    mongo_uri = os.getenv("MONGO_URI", "")
    db_name = os.getenv("DB_NAME", "GS_Website")
    proj_desc_col = os.getenv("PROJECT_DESCRIPTION_COLLECTION", "project_description")
    rocket_col = os.getenv("ROCKET_COLLECTION", "rocket")
    port = os.getenv("PORT", "5000")

    return {
        "mongo_uri": mongo_uri,
        "db_name": db_name,
        "proj_desc_col": proj_desc_col,
        "rocket_col": rocket_col,
        "port": port
    }

def parse_iso_date(date_val):
    """Parse ISO date string or dict to datetime object."""
    if isinstance(date_val, dict) and "$date" in date_val:
        date_str = date_val["$date"]
    elif isinstance(date_val, str):
        date_str = date_val
    elif isinstance(date_val, datetime):
        return date_val
    else:
        return datetime.now(timezone.utc)

    # Clean up standard ISO format with Z
    if date_str.endswith("Z"):
        date_str = date_str[:-1] + "+00:00"
    try:
        return datetime.fromisoformat(date_str)
    except ValueError:
        return datetime.now(timezone.utc)

def deep_merge(dict1: dict, dict2: dict) -> dict:
    """Recursively merges dict2 into dict1."""
    merged = dict1.copy()
    for key, value in dict2.items():
        if key in merged and isinstance(merged[key], dict) and isinstance(value, dict):
            merged[key] = deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged

def upload_rocket(project_info: dict, rocket_info: dict, env_path: str = ENV_FILE, mode: str = "auto", project_id: str = None) -> dict:
    """
    Uploads or updates rocket project data in MongoDB.
    
    Modes:
    - "auto" (default): Updates existing project if matched by ID or projectName; creates new otherwise.
    - "update": Only updates an existing project; raises ValueError if not found.
    - "insert": Always creates a new project document.
    """
    config = load_config(env_path)
    mongo_uri = config["mongo_uri"]

    if not mongo_uri or "<YOUR_" in mongo_uri:
        raise ValueError(
            f"Invalid MONGO_URI in '{env_path}'. Please update the MONGO_URI placeholder with your actual MongoDB connection string."
        )

    client = MongoClient(mongo_uri)
    db = client[config["db_name"]]
    proj_desc_collection = db[config["proj_desc_col"]]
    rocket_collection = db[config["rocket_col"]]

    target_name = project_info.get("projectName") or rocket_info.get("projectName")
    existing_proj_desc = None

    search_id = project_id or project_info.get("_id") or project_info.get("id")
    if search_id:
        try:
            existing_proj_desc = proj_desc_collection.find_one({"_id": ObjectId(search_id)})
        except Exception:
            pass

    if not existing_proj_desc and target_name and mode != "insert":
        existing_proj_desc = proj_desc_collection.find_one({"projectName": target_name})

    # Strict update mode check
    if mode == "update" and not existing_proj_desc:
        client.close()
        raise ValueError(f"Project '{target_name}' not found for update. Use mode='auto' or mode='insert' to create a new project.")

    # --- UPDATE PATH ---
    if existing_proj_desc and mode in ("auto", "update"):
        proj_desc_id = existing_proj_desc["_id"]
        rocket_data_id = existing_proj_desc.get("projectData")

        # Update Project Description document
        updated_proj_desc = deep_merge(existing_proj_desc, project_info)
        if rocket_data_id:
            updated_proj_desc["projectData"] = rocket_data_id
        updated_proj_desc.pop("_id", None)

        proj_desc_collection.update_one({"_id": proj_desc_id}, {"$set": updated_proj_desc})
        print(f"[1/2] Successfully updated Project Description collection. _id: {proj_desc_id}")

        # Prepare Rocket collection updates
        processed_rocket_info = rocket_info.copy()
        if "launchDate" in processed_rocket_info:
            processed_rocket_info["launchDate"] = parse_iso_date(processed_rocket_info["launchDate"])

        if "payload" in processed_rocket_info and isinstance(processed_rocket_info["payload"], dict):
            payload = processed_rocket_info["payload"].copy()
            payload_data_raw = payload.get("payloadData")
            if isinstance(payload_data_raw, dict) and "$oid" in payload_data_raw:
                payload["payloadData"] = ObjectId(payload_data_raw["$oid"])
            elif isinstance(payload_data_raw, str) and len(payload_data_raw) == 24:
                try:
                    payload["payloadData"] = ObjectId(payload_data_raw)
                except Exception:
                    pass
            processed_rocket_info["payload"] = payload

        existing_rocket = None
        if rocket_data_id:
            existing_rocket = rocket_collection.find_one({"_id": rocket_data_id})
        if not existing_rocket and target_name:
            existing_rocket = rocket_collection.find_one({"projectName": target_name})

        if existing_rocket:
            rocket_data_id = existing_rocket["_id"]
            updated_rocket = deep_merge(existing_rocket, processed_rocket_info)
            updated_rocket.pop("_id", None)
            rocket_collection.update_one({"_id": rocket_data_id}, {"$set": updated_rocket})
            print(f"[2/2] Successfully updated Rocket collection. _id: {rocket_data_id}")
        else:
            if not rocket_data_id:
                rocket_data_id = ObjectId()
            raw_date = processed_rocket_info.get("launchDate", datetime.now(timezone.utc).isoformat())
            launch_date_dt = parse_iso_date(raw_date) if not isinstance(raw_date, datetime) else raw_date

            rocket_doc = {
                "_id": rocket_data_id,
                "projectName": target_name or "Rocket name",
                "launchDate": launch_date_dt,
                "motorType": processed_rocket_info.get("motorType", "Motor type"),
                "altitude": processed_rocket_info.get("altitude", {"target": "target", "actual": "actual", "unit": "m"}),
                "payload": processed_rocket_info.get("payload", {}),
                "status": processed_rocket_info.get("status", "Launched"),
                "googleDriveLinks": processed_rocket_info.get("googleDriveLinks", ["https://drive.google.com/link-to-image"])
            }
            rocket_collection.insert_one(rocket_doc)
            proj_desc_collection.update_one({"_id": proj_desc_id}, {"$set": {"projectData": rocket_data_id}})
            print(f"[2/2] Linked new Rocket collection document. _id: {rocket_data_id}")

        client.close()
        return {
            "action": "updated",
            "projectDescriptionId": str(proj_desc_id),
            "rocketDataId": str(rocket_data_id)
        }

    # --- INSERT (CREATE) PATH ---
    rocket_data_id = ObjectId()

    # 1. Prepare Project Description document
    project_desc_doc = {
        "projectName": project_info.get("projectName", rocket_info.get("projectName", "Rocket Project")),
        "projectType": project_info.get("projectType", "Rocket"),
        "projectDescription": project_info.get("projectDescription", "Description"),
        "projectData": rocket_data_id,  # Linked ObjectId reference
        "projectLinks": project_info.get("projectLinks", [
            "https://drive.google.com/folder-link",
            "https://github.com/repo-link"
        ])
    }

    desc_result = proj_desc_collection.insert_one(project_desc_doc)
    proj_desc_id = desc_result.inserted_id
    print(f"[1/2] Successfully uploaded to Project Description collection. _id: {proj_desc_id}")

    # Prepare launch date
    raw_date = rocket_info.get("launchDate", datetime.now(timezone.utc).isoformat())
    launch_date_dt = parse_iso_date(raw_date)

    # Process payload field
    payload = rocket_info.get("payload", {}).copy() if isinstance(rocket_info.get("payload"), dict) else {}
    payload_data_raw = payload.get("payloadData")
    if isinstance(payload_data_raw, dict) and "$oid" in payload_data_raw:
        payload["payloadData"] = ObjectId(payload_data_raw["$oid"])
    elif isinstance(payload_data_raw, str) and len(payload_data_raw) == 24:
        try:
            payload["payloadData"] = ObjectId(payload_data_raw)
        except Exception:
            pass

    # 2. Prepare Rocket collection document
    rocket_doc = {
        "_id": rocket_data_id,
        "projectName": rocket_info.get("projectName", "Rocket name"),
        "launchDate": launch_date_dt,
        "motorType": rocket_info.get("motorType", "Motor type"),
        "altitude": rocket_info.get("altitude", {
            "target": "target",
            "actual": "actual",
            "unit": "m"
        }),
        "payload": payload,
        "status": rocket_info.get("status", "Launched"),
        "googleDriveLinks": rocket_info.get("googleDriveLinks", [
            "https://drive.google.com/link-to-image"
        ])
    }

    try:
        rocket_result = rocket_collection.insert_one(rocket_doc)
        print(f"[2/2] Successfully uploaded to Rocket collection. _id: {rocket_result.inserted_id}")
    except Exception as e:
        print(f"Error inserting into Rocket collection. Rolling back Project Description document {proj_desc_id}...")
        proj_desc_collection.delete_one({"_id": proj_desc_id})
        raise e
    finally:
        client.close()

    return {
        "action": "created",
        "projectDescriptionId": str(proj_desc_id),
        "rocketDataId": str(rocket_data_id)
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload or update Rocket data in MongoDB.")
    parser.add_argument("--json", type=str, required=True, help="Path to JSON file containing {project_info, rocket_info}.")
    parser.add_argument("--mode", type=str, choices=["auto", "update", "insert"], default="auto", help="Upload mode: 'auto' (upsert), 'update' (strict update), or 'insert' (always create new).")
    parser.add_argument("--id", type=str, default=None, help="Explicit ObjectId string of existing Project Description document to update.")
    args = parser.parse_args()

    if not os.path.exists(args.json):
        print(f"Error: Specified JSON file '{args.json}' does not exist.")
        sys.exit(1)

    with open(args.json, "r") as f:
        data = json.load(f)
        proj_info = data.get("project_info", {})
        rock_info = data.get("rocket_info", {})

    try:
        res = upload_rocket(proj_info, rock_info, mode=args.mode, project_id=args.id)
        print("Operation completed successfully:", res)
    except Exception as err:
        print(f"Operation failed: {err}")
        sys.exit(1)

