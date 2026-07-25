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

def upload_rocket(project_info: dict, rocket_info: dict, env_path: str = ENV_FILE) -> dict:
    """
    Uploads rocket project data to MongoDB.
    1. Pre-generates ObjectId for actual rocket document.
    2. Inserts document into Project Description collection FIRST.
    3. Inserts actual rocket document into Rocket collection SECOND with the linked ObjectId.
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

    # Pre-generate ObjectId for the actual rocket data document
    rocket_data_id = ObjectId()

    # 1. Prepare Project Description document (Schema 1)
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

    # Insert into project description collection FIRST
    desc_result = proj_desc_collection.insert_one(project_desc_doc)
    proj_desc_id = desc_result.inserted_id
    print(f"[1/2] Successfully uploaded to Project Description collection. _id: {proj_desc_id}")

    # Prepare launch date
    raw_date = rocket_info.get("launchDate", datetime.now(timezone.utc).isoformat())
    launch_date_dt = parse_iso_date(raw_date)

    # Process payload field
    payload = rocket_info.get("payload", {})
    payload_data_raw = payload.get("payloadData")
    if isinstance(payload_data_raw, dict) and "$oid" in payload_data_raw:
        payload["payloadData"] = ObjectId(payload_data_raw["$oid"])
    elif isinstance(payload_data_raw, str) and len(payload_data_raw) == 24:
        try:
            payload["payloadData"] = ObjectId(payload_data_raw)
        except Exception:
            pass

    # 2. Prepare Rocket collection document (Schema 3)
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
        # Insert into Rocket collection SECOND
        rocket_result = rocket_collection.insert_one(rocket_doc)
        print(f"[2/2] Successfully uploaded to Rocket collection. _id: {rocket_result.inserted_id}")
    except Exception as e:
        # Rollback project description insert if rocket insertion fails
        print(f"Error inserting into Rocket collection. Rolling back Project Description document {proj_desc_id}...")
        proj_desc_collection.delete_one({"_id": proj_desc_id})
        raise e
    finally:
        client.close()

    return {
        "projectDescriptionId": str(proj_desc_id),
        "rocketDataId": str(rocket_data_id)
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload Rocket data to MongoDB.")
    parser.add_argument("--json", type=str, required=True, help="Path to JSON file containing {project_info, rocket_info}.")
    args = parser.parse_args()

    if not os.path.exists(args.json):
        print(f"Error: Specified JSON file '{args.json}' does not exist.")
        sys.exit(1)

    with open(args.json, "r") as f:
        data = json.load(f)
        proj_info = data.get("project_info", {})
        rock_info = data.get("rocket_info", {})

    try:
        res = upload_rocket(proj_info, rock_info)
        print("Upload completed successfully:", res)
    except Exception as err:
        print(f"Upload failed: {err}")
        sys.exit(1)
