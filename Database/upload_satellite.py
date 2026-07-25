import os
import sys
import json
import argparse
from bson import ObjectId
from pymongo import MongoClient
from dotenv import load_dotenv

# Path to .env.satellite script configuration
ENV_FILE = os.path.join(os.path.dirname(__file__), '.env.satellite')

def load_config(env_path=ENV_FILE):
    """Load environment variables from the specified .env file."""
    load_dotenv(env_path, override=True)
    mongo_uri = os.getenv("MONGO_URI", "")
    db_name = os.getenv("DB_NAME", "GS_Website")
    proj_desc_col = os.getenv("PROJECT_DESCRIPTION_COLLECTION", "project_description")
    satellite_col = os.getenv("SATELLITE_COLLECTION", "satellite")
    port = os.getenv("PORT", "5000")

    return {
        "mongo_uri": mongo_uri,
        "db_name": db_name,
        "proj_desc_col": proj_desc_col,
        "satellite_col": satellite_col,
        "port": port
    }

def upload_satellite(project_info: dict, satellite_info: dict, env_path: str = ENV_FILE) -> dict:
    """
    Uploads satellite project data to MongoDB.
    1. Pre-generates ObjectId for actual satellite document.
    2. Inserts document into Project Description collection FIRST.
    3. Inserts actual satellite document into Satellite collection SECOND with the linked ObjectId.
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
    satellite_collection = db[config["satellite_col"]]

    # Pre-generate ObjectId for actual satellite document
    sat_data_id = ObjectId()

    # 1. Prepare Project Description document (Schema 1)
    project_desc_doc = {
        "projectName": project_info.get("projectName", "Satellite Project"),
        "projectType": project_info.get("projectType", "Satellite"),
        "projectDescription": project_info.get("projectDescription", "Description"),
        "projectData": sat_data_id,  # Linked ObjectId reference
        "projectLinks": project_info.get("projectLinks", [
            "https://drive.google.com/folder-link",
            "https://github.com/repo-link"
        ])
    }

    # Insert into project description collection FIRST
    desc_result = proj_desc_collection.insert_one(project_desc_doc)
    proj_desc_id = desc_result.inserted_id
    print(f"[1/2] Successfully uploaded to Project Description collection. _id: {proj_desc_id}")

    # 2. Prepare Satellite collection document (Schema 4)
    satellite_doc = {
        "_id": sat_data_id,
        "formFactor": satellite_info.get("formFactor", ""),
        "massGrams": satellite_info.get("massGrams", ""),
        "deployment": satellite_info.get("deployment", {
            "targetAltitudeMeters": "",
            "ejectionMechanism": ""
        }),
        "recoverySystem": satellite_info.get("recoverySystem", {
            "trackingMethod": "",
            "successfullyRecovered": False
        }),
        "powerSystem": satellite_info.get("powerSystem", {
            "batteryType": "",
            "capacityMAh": ""
        }),
        "instruments": satellite_info.get("instruments", []),
        "missionStatus": satellite_info.get("missionStatus", "Awaiting Launch"),
        "googleDriveLinks": satellite_info.get("googleDriveLinks", [
            "http://drive.google.com/link-to-image"
        ])
    }

    try:
        # Insert into Satellite collection SECOND
        sat_result = satellite_collection.insert_one(satellite_doc)
        print(f"[2/2] Successfully uploaded to Satellite collection. _id: {sat_result.inserted_id}")
    except Exception as e:
        # Rollback project description insert if satellite insertion fails
        print(f"Error inserting into Satellite collection. Rolling back Project Description document {proj_desc_id}...")
        proj_desc_collection.delete_one({"_id": proj_desc_id})
        raise e
    finally:
        client.close()

    return {
        "projectDescriptionId": str(proj_desc_id),
        "satelliteDataId": str(sat_data_id)
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload Satellite data to MongoDB.")
    parser.add_argument("--json", type=str, required=True, help="Path to JSON file containing {project_info, satellite_info}.")
    args = parser.parse_args()

    if not os.path.exists(args.json):
        print(f"Error: Specified JSON file '{args.json}' does not exist.")
        sys.exit(1)

    with open(args.json, "r") as f:
        data = json.load(f)
        proj_info = data.get("project_info", {})
        sat_info = data.get("satellite_info", {})

    try:
        res = upload_satellite(proj_info, sat_info)
        print("Upload completed successfully:", res)
    except Exception as err:
        print(f"Upload failed: {err}")
        sys.exit(1)
