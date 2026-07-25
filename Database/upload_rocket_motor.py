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

def upload_rocket_motor(project_info: dict, rocket_motor_info: dict, env_path: str = ENV_FILE) -> dict:
    """
    Uploads rocket motor project data to MongoDB.
    1. Pre-generates ObjectId for actual rocket motor document.
    2. Inserts document into Project Description collection FIRST.
    3. Inserts actual rocket motor document into Rocket Motor collection SECOND with the linked ObjectId.
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

    # Pre-generate ObjectId for actual rocket motor document
    motor_data_id = ObjectId()

    # 1. Prepare Project Description document (Schema 1)
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

    # Insert into project description collection FIRST
    desc_result = proj_desc_collection.insert_one(project_desc_doc)
    proj_desc_id = desc_result.inserted_id
    print(f"[1/2] Successfully uploaded to Project Description collection. _id: {proj_desc_id}")

    # 2. Prepare Rocket Motor collection document (Schema 2)
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
        # Insert into Rocket Motor collection SECOND
        motor_result = rocket_motor_collection.insert_one(rocket_motor_doc)
        print(f"[2/2] Successfully uploaded to Rocket Motor collection. _id: {motor_result.inserted_id}")
    except Exception as e:
        # Rollback project description insert if rocket motor insertion fails
        print(f"Error inserting into Rocket Motor collection. Rolling back Project Description document {proj_desc_id}...")
        proj_desc_collection.delete_one({"_id": proj_desc_id})
        raise e
    finally:
        client.close()

    return {
        "projectDescriptionId": str(proj_desc_id),
        "rocketMotorDataId": str(motor_data_id)
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload Rocket Motor data to MongoDB.")
    parser.add_argument("--json", type=str, required=True, help="Path to JSON file containing {project_info, rocket_motor_info}.")
    args = parser.parse_args()

    if not os.path.exists(args.json):
        print(f"Error: Specified JSON file '{args.json}' does not exist.")
        sys.exit(1)

    with open(args.json, "r") as f:
        data = json.load(f)
        proj_info = data.get("project_info", {})
        motor_info = data.get("rocket_motor_info", {})

    try:
        res = upload_rocket_motor(proj_info, motor_info)
        print("Upload completed successfully:", res)
    except Exception as err:
        print(f"Upload failed: {err}")
        sys.exit(1)
