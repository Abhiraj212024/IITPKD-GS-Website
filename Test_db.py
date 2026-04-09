import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

DATABASE_NAME = "GS_Website"
MONGO_URI = os.getenv("MONGO_URI_READONLY")


def test_connection():
    """Test basic connection and authentication."""
    print("=" * 50)
    print("  MongoDB Atlas - Read-Only User Test")
    print("=" * 50)

    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.admin.command("ping")
        print("\n✅ Connection successful! User authenticated.")
    except ConnectionFailure:
        print("\n❌ Connection failed: Could not reach MongoDB Atlas.")
        print("   Check your network or cluster address.")
        return None
    except OperationFailure as e:
        print(f"\n❌ Authentication failed: {e}")
        print("   Check the username and password.")
        return None

    return client


def test_read(client):
    """Test read access on the GS_Website database."""
    db = client[DATABASE_NAME]

    print(f"\n--- Database: {DATABASE_NAME} ---")
    collections = db.list_collection_names()
    print(f"Collections found: {collections}\n")

    for col_name in collections:
        collection = db[col_name]
        count = collection.count_documents({})
        print(f"{col_name}: {count} documents")

        # Show a sample document (first one)
        sample = collection.find_one()
        if sample:
            sample.pop("_id", None)  # Remove _id for cleaner output
            print(f"   Sample: {dict(list(sample.items())[:4])}...")  # Show first 4 fields
        print()


def test_read_only(client):
    """Verify the user has read-only access (cannot write)."""
    db = client[DATABASE_NAME]
    test_col = db["_test_permission"]

    print("--- Read-Only Permission Check ---")
    try:
        test_col.insert_one({"test": True})
        # If we get here, user has write access — not expected
        test_col.delete_one({"test": True})
        print("User has WRITE access — expected read-only")
    except OperationFailure:
        print("Confirmed: User is READ-ONLY (cannot write)")


if __name__ == "__main__":
    client = test_connection()
    if client:
        test_read(client)
        test_read_only(client)
        client.close()
        print("\n" + "=" * 50)
        print("  ✅ All tests complete!")
        print("=" * 50)

