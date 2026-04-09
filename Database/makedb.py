import gspread
from pymongo import MongoClient
import os
import json
import sys

from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# If modifying these scopes, delete the file token.json.
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/drive.readonly"
]

# MongoDB Configuration
# Use MONGO_URI for MongoDB Atlas (e.g. mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/)
# Falls back to local MongoDB if MONGO_URI is not set
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
DATABASE_NAME = 'GS_Website'

# Google Sheets Configuration
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), 'credentials.json')
TOKEN_FILE = os.path.join(os.path.dirname(__file__), 'token.json')

# Spreadsheet configurations
SPREADSHEET_CONFIG = {
    # Members spreadsheet
    "1EN6o53VtfWdWVBXgCwqizjKm6klVwGWHkiCK0ytPhZw": {
        "collection": "members",
        "sheet_name": None,  # None means use first sheet (sheet1)
    },
    # Alumni spreadsheet
    "1zGI7kEuoaMsMjGCL0OPknCtMYytF55bwTLb1UROCeVw": {
        "collection": "alumni",
        "sheet_name": None,  # None means use first sheet (sheet1)
    },
}


def get_mongo_client():
    """Create and return MongoDB client and database."""
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    return client, db


def get_sheets_client():
    """Authenticate with Google Sheets using OAuth."""
    creds = None

    # Load existing token if available
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    # If no valid credentials, let user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CREDENTIALS_FILE):
                raise FileNotFoundError(
                    f"Credentials file not found: {CREDENTIALS_FILE}\n"
                    "Please download OAuth client JSON from Google Cloud Console."
                )
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)

        # Save credentials for next run
        with open(TOKEN_FILE, "w") as token:
            token.write(creds.to_json())

    # Create gspread client with OAuth credentials
    return gspread.authorize(creds)


def import_spreadsheet_to_mongo(gc, spreadsheet_id: str, config: dict, db):
    """Import a single spreadsheet to MongoDB collection."""
    collection_name = config["collection"]
    sheet_name = config.get("sheet_name")

    print(f"Attempting to open spreadsheet: {spreadsheet_id}")

    # Open spreadsheet
    spreadsheet = gc.open_by_key(spreadsheet_id)
    print(f"  Opened: {spreadsheet.title}")

    # Get worksheet
    if sheet_name:
        worksheet = spreadsheet.worksheet(sheet_name)
    else:
        worksheet = spreadsheet.sheet1

    # Get all records as list of dicts
    records = worksheet.get_all_records()

    if not records:
        print(f"No data found in spreadsheet")
        return 0

    # Get collection and clear existing data
    collection = db[collection_name]
    collection.delete_many({})

    # Insert new data
    result = collection.insert_many(records)
    count = len(result.inserted_ids)
    print(f"Inserted {count} records into '{collection_name}'")

    return count


def view_database():
    """View all collections and their schema in MongoDB."""
    client, db = get_mongo_client()
    print(f"\n{'='*50}")
    print(f"📊 Database: {DATABASE_NAME}")
    print(f"{'='*50}")

    for name in db.list_collection_names():
        collection = db[name]
        count = collection.count_documents({})
        print(f"\nCollection: {name} ({count} documents)")
        print("-" * 40)

        sample = collection.find_one()
        if sample:
            sample["_id"] = str(sample["_id"])
            print("🔑 Schema (fields → types):")
            for key, value in sample.items():
                print(f"   {key}: {type(value).__name__}")
            print(f"\n📄 Sample document:")
            print(json.dumps(sample, indent=2, default=str))
        else:
            print("  (empty)")

        # Show all documents if collection is small
        if 1 < count <= 20:
            print(f"\nAll documents:")
            for doc in collection.find():
                doc["_id"] = str(doc["_id"])
                print(json.dumps(doc, indent=2, default=str))
        elif count > 20:
            print(f"\nFirst 5 documents:")
            for doc in collection.find().limit(5):
                doc["_id"] = str(doc["_id"])
                print(json.dumps(doc, indent=2, default=str))
            print(f"  ... and {count - 5} more")

    client.close()


def main():
    """Main function to import all spreadsheets to MongoDB."""
    print("=" * 50)
    print("Google Sheets → MongoDB Import")
    print("=" * 50)

    try:
        # Initialize clients
        gc = get_sheets_client()
        print("Google Sheets authentication successful")

        client, db = get_mongo_client()
        print(f"Connected to MongoDB: {DATABASE_NAME}")

        total_imported = 0

        # Process each spreadsheet
        for spreadsheet_id, config in SPREADSHEET_CONFIG.items():
            try:
                count = import_spreadsheet_to_mongo(gc, spreadsheet_id, config, db)
                total_imported += count
            except gspread.exceptions.SpreadsheetNotFound:
                print(f"  Spreadsheet not found: {spreadsheet_id}")
                print("   Check ID and ensure it's shared with your Google account")
            except gspread.exceptions.WorksheetNotFound as e:
                print(f"  Worksheet not found: {e}")
            except gspread.exceptions.APIError as e:
                print(f"  Google API Error: {e.response.status_code}")
                print(f"   {e.response.text}")
            except Exception as e:
                print(f"  Error ({type(e).__name__}): {e}")
                import traceback
                traceback.print_exc()

        print("\n" + "=" * 50)
        print(f"Import complete! Total: {total_imported} documents")
        print("=" * 50)

        client.close()

    except FileNotFoundError as e:
        print(f"{e}")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    if "--view" in sys.argv:
        view_database()
    else:
        main()
