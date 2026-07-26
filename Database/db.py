import os

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')

# Mapping from Google Sheets column names to clean MongoDB field names
FIELD_MAPPING = {
    "Name": "name",
    "Photo": "photo",
    "Subsystem": "subsystem",
    "Hierarchal position": "position",
    "Email ID": "email",
    "LinkedIN ID": "linkedin",
    "Instagram": "instagram",
    "Current Employer": "currentEmployer",
}

def _map_record(record: dict) -> dict:
    """Rename Google Sheets columns to clean MongoDB field names."""
    mapped = {}
    for key, value in record.items():
        mapped_key = FIELD_MAPPING.get(key, key)
        mapped[mapped_key] = value
    return mapped

def get_db(db_name='Members'):
    client = MongoClient(MONGO_URI)
    return client[db_name]

def sync_collections_from_sheets(unique_fields: dict = None):
    if unique_fields is None:
        unique_fields = {"members": "email", "alumni": "email"}

    from makedb import get_sheets_client, SPREADSHEET_CONFIG

    try:
        gc = get_sheets_client()
        db = get_db('Members')

        for sheet_id, config in SPREADSHEET_CONFIG.items():
            collection_name = config.get("collection")
            sheet_name = config.get("sheet_name")

            if not collection_name:
                continue

            print(f"Syncing collection '{collection_name}'...")

            try:
                spreadsheet = gc.open_by_key(sheet_id)
                if sheet_name:
                    worksheet = spreadsheet.worksheet(sheet_name)
                else:
                    worksheet = spreadsheet.sheet1

                records = worksheet.get_all_records()
                if not records:
                    print(f"  No data found in the {collection_name} spreadsheet.")
                    continue

                collection = db[collection_name]
                unique_field = unique_fields.get(collection_name, "email")
                operations = []

                for record in records:
                    mapped = _map_record(record)

                    # Upsert using the unique field (e.g., email) to match existing database entries
                    if unique_field in mapped:
                        filter_query = {unique_field: mapped[unique_field]}
                    else:
                        filter_query = mapped

                    operations.append(
                        UpdateOne(filter_query, {"$set": mapped}, upsert=True)
                    )

                if operations:
                    result = collection.bulk_write(operations)
                    print(f"  Sync complete for '{collection_name}'. Matched: {result.matched_count}, Modified: {result.modified_count}, "
                          f"Upserted (New): {result.upserted_count}")

            except Exception as e:
                print(f"  An error occurred while syncing collection '{collection_name}': {e}")

        return True

    except Exception as e:
        print(f"An error occurred during global sync: {e}")
        return False

def make_satellite(satellite_data: dict, project_data: dict, update_if_exists: bool = True):
    try:
        from upload_satellite import upload_satellite
        mode = "auto" if update_if_exists else "insert"
        res = upload_satellite(project_data, satellite_data, mode=mode)
        return res
    except Exception as e:
        print(f"An error occurred while saving satellite project: {e}")
        return False

def make_rocket(rocket_data: dict, project_data: dict, update_if_exists: bool = True):
    try:
        from upload_rocket import upload_rocket
        mode = "auto" if update_if_exists else "insert"
        res = upload_rocket(project_data, rocket_data, mode=mode)
        return res
    except Exception as e:
        print(f"An error occurred while saving rocket project: {e}")
        return False

def update_rocket(project_info: dict, rocket_info: dict, project_id: str = None):
    """Updates an existing rocket project in MongoDB Atlas."""
    from upload_rocket import upload_rocket
    return upload_rocket(project_info, rocket_info, mode="update", project_id=project_id)

def update_rocket_motor(project_info: dict, rocket_motor_info: dict, project_id: str = None):
    """Updates an existing rocket motor project in MongoDB Atlas."""
    from upload_rocket_motor import upload_rocket_motor
    return upload_rocket_motor(project_info, rocket_motor_info, mode="update", project_id=project_id)

def update_satellite(project_info: dict, satellite_info: dict, project_id: str = None):
    """Updates an existing satellite project in MongoDB Atlas."""
    from upload_satellite import upload_satellite
    return upload_satellite(project_info, satellite_info, mode="update", project_id=project_id)

