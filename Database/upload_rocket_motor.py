import os
import sys
import json
import argparse
from bson import ObjectId
from pymongo import MongoClient
from dotenv import load_dotenv

# Path to .env.rocket_motor script configuration
ENV_FILE = os.path.join(os.path.dirname(__file__), '.env.rocket_motor')

def load_config(env_path=ENV_FILE):
    """Load environment variables from the specified .env file."""
    load_dotenv(env_path, override=True)
    mongo_uri = os.getenv("MONGO_URI", "")
    db_name = os.getenv("DB_NAME", "GS_Website")
    proj_desc_col = os.getenv("PROJECT_DESCRIPTION_COLLECTION", "project_description")
    rocket_motor_col = os.getenv("ROCKET_MOTOR_COLLECTION", "rocket_motor")
    port = os.getenv("PORT", "5000")

    return {
        "mongo_uri": mongo_uri,
        "db_name": db_name,
        "proj_desc_col": proj_desc_col,
        "rocket_motor_col": rocket_motor_col,
        "port": port
    }

def deep_merge(dict1: dict, dict2: dict) -> dict:
    """Recursively merges dict2 into dict1."""
    merged = dict1.copy()
    for key, value in dict2.items():
        if key in merged and isinstance(merged[key], dict) and isinstance(value, dict):
            merged[key] = deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged

def upload_rocket_motor(project_info: dict, rocket_motor_info: dict, env_path: str = ENV_FILE, mode: str = "auto", project_id: str = None) -> dict:
    """
    Uploads or updates rocket motor project data in MongoDB.

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
    rocket_motor_collection = db[config["rocket_motor_col"]]

    target_name = project_info.get("projectName") or rocket_motor_info.get("projectName")
    existing_proj_desc = None

    search_id = project_id or project_info.get("_id") or project_info.get("id")
    if search_id:
        try:
            existing_proj_desc = proj_desc_collection.find_one({"_id": ObjectId(search_id)})
        except Exception:
            pass

    if not existing_proj_desc and target_name and mode != "insert":
        existing_proj_desc = proj_desc_collection.find_one({"projectName": target_name})

    if mode == "update" and not existing_proj_desc:
        client.close()
        raise ValueError(f"Project '{target_name}' not found for update. Use mode='auto' or mode='insert' to create a new project.")

    # --- UPDATE PATH ---
    if existing_proj_desc and mode in ("auto", "update"):
        proj_desc_id = existing_proj_desc["_id"]
        motor_data_id = existing_proj_desc.get("projectData")

        # Update Project Description document
        updated_proj_desc = deep_merge(existing_proj_desc, project_info)
        if motor_data_id:
            updated_proj_desc["projectData"] = motor_data_id
        updated_proj_desc.pop("_id", None)

        proj_desc_collection.update_one({"_id": proj_desc_id}, {"$set": updated_proj_desc})
        print(f"[1/2] Successfully updated Project Description collection. _id: {proj_desc_id}")

        existing_motor = None
        if motor_data_id:
            existing_motor = rocket_motor_collection.find_one({"_id": motor_data_id})
        if not existing_motor and target_name:
            existing_motor = rocket_motor_collection.find_one({"projectName": target_name})

        if existing_motor:
            motor_data_id = existing_motor["_id"]
            updated_motor = deep_merge(existing_motor, rocket_motor_info)
            updated_motor.pop("_id", None)
            rocket_motor_collection.update_one({"_id": motor_data_id}, {"$set": updated_motor})
            print(f"[2/2] Successfully updated Rocket Motor collection. _id: {motor_data_id}")
        else:
            if not motor_data_id:
                motor_data_id = ObjectId()
            rocket_motor_doc = {
                "_id": motor_data_id,
                "projectName": target_name or "Name",
                "projectData": rocket_motor_info.get("projectData", {
                    "Progress": "",
                    "Materials": {
                        "Oxidizer": "",
                        "Propellant": "",
                        "Body Tube": "",
                        "Thermal lining": ""
                    }
                }),
                "projectStatus": rocket_motor_info.get("projectStatus", "Status"),
                "projectLinks": rocket_motor_info.get("projectLinks", [
                    "https://drive.google.com/folder-link",
                    "https://github.com/repo-link"
                ])
            }
            rocket_motor_collection.insert_one(rocket_motor_doc)
            proj_desc_collection.update_one({"_id": proj_desc_id}, {"$set": {"projectData": motor_data_id}})
            print(f"[2/2] Linked new Rocket Motor collection document. _id: {motor_data_id}")

        client.close()
        return {
            "action": "updated",
            "projectDescriptionId": str(proj_desc_id),
            "rocketMotorDataId": str(motor_data_id)
        }

    # --- INSERT (CREATE) PATH ---
    motor_data_id = ObjectId()

    # 1. Prepare Project Description document
    project_desc_doc = {
        "projectName": project_info.get("projectName", rocket_motor_info.get("projectName", "Rocket Motor Project")),
        "projectType": project_info.get("projectType", "Rocket Motor"),
        "projectDescription": project_info.get("projectDescription", "Description"),
        "projectData": motor_data_id,  # Linked ObjectId reference
        "projectLinks": project_info.get("projectLinks", [
            "https://drive.google.com/folder-link",
            "https://github.com/repo-link"
        ])
    }

    desc_result = proj_desc_collection.insert_one(project_desc_doc)
    proj_desc_id = desc_result.inserted_id
    print(f"[1/2] Successfully uploaded to Project Description collection. _id: {proj_desc_id}")

    # 2. Prepare Rocket Motor collection document
    rocket_motor_doc = {
        "_id": motor_data_id,
        "projectName": rocket_motor_info.get("projectName", "Name"),
        "projectData": rocket_motor_info.get("projectData", {
            "Progress": "",
            "Materials": {
                "Oxidizer": "",
                "Propellant": "",
                "Body Tube": "",
                "Thermal lining": ""
            }
        }),
        "projectStatus": rocket_motor_info.get("projectStatus", "Status"),
        "projectLinks": rocket_motor_info.get("projectLinks", [
            "https://drive.google.com/folder-link",
            "https://github.com/repo-link"
        ])
    }

    try:
        motor_result = rocket_motor_collection.insert_one(rocket_motor_doc)
        print(f"[2/2] Successfully uploaded to Rocket Motor collection. _id: {motor_result.inserted_id}")
    except Exception as e:
        print(f"Error inserting into Rocket Motor collection. Rolling back Project Description document {proj_desc_id}...")
        proj_desc_collection.delete_one({"_id": proj_desc_id})
        raise e
    finally:
        client.close()

    return {
        "action": "created",
        "projectDescriptionId": str(proj_desc_id),
        "rocketMotorDataId": str(motor_data_id)
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload or update Rocket Motor data in MongoDB.")
    parser.add_argument("--json", type=str, required=True, help="Path to JSON file containing {project_info, rocket_motor_info}.")
    parser.add_argument("--mode", type=str, choices=["auto", "update", "insert"], default="auto", help="Upload mode: 'auto' (upsert), 'update' (strict update), or 'insert' (always create new).")
    parser.add_argument("--id", type=str, default=None, help="Explicit ObjectId string of existing Project Description document to update.")
    args = parser.parse_args()

    if not os.path.exists(args.json):
        print(f"Error: Specified JSON file '{args.json}' does not exist.")
        sys.exit(1)

    with open(args.json, "r") as f:
        data = json.load(f)
        proj_info = data.get("project_info", {})
        motor_info = data.get("rocket_motor_info", {})

    try:
        res = upload_rocket_motor(proj_info, motor_info, mode=args.mode, project_id=args.id)
        print("Operation completed successfully:", res)
    except Exception as err:
        print(f"Operation failed: {err}")
        sys.exit(1)

