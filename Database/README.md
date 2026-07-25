# Database Upload Scripts Guide

This directory contains scripts to upload data for **Rocket**, **Rocket Motor**, and **Satellite** projects to the MongoDB database.

---

## How to Use the Upload Scripts

You can run each script directly from the command line by passing a JSON file (`--json`), or by importing the upload functions into your own Python scripts. Sample JSON files are provided in this directory for reference.

---

### 1. Upload Rocket Data (`upload_rocket.py`)

#### Command Line Usage:
```bash
python Database/upload_rocket.py --json Database/sample_rocket.json
```

#### JSON File Format ([`sample_rocket.json`](~/IITPKD-GS-Website/Database/sample_rocket.json)):
```json
{
  "project_info": {
    "projectName": "<PROJECT_NAME>",
    "projectType": "Rocket",
    "projectDescription": "<PROJECT_DESCRIPTION>",
    "projectLinks": [
      "<PROJECT_LINK_1>",
      "<PROJECT_LINK_2>"
    ]
  },
  "rocket_info": {
    "projectName": "<PROJECT_NAME>",
    "launchDate": "<YYYY-MM-DDTHH:MM:SS.000Z>",
    "motorType": "<MOTOR_TYPE>",
    "altitude": {
      "target": "<TARGET_ALTITUDE>",
      "actual": "<ACTUAL_ALTITUDE>",
      "unit": "<UNIT>"
    },
    "payload": {
      "description": "<PAYLOAD_DESCRIPTION>",
      "payloadData": {
        "$oid": "<SATELLITE_OBJECT_ID>"
      },
      "weightGrams": "<WEIGHT_IN_GRAMS>"
    },
    "status": "<LAUNCH_STATUS>",
    "googleDriveLinks": [
      "<GOOGLE_DRIVE_LINK_1>"
    ]
  }
}
```

#### Python Usage:
```python
from upload_rocket import upload_rocket

project_info = {
    "projectName": "<PROJECT_NAME>",
    "projectType": "Rocket",
    "projectDescription": "<PROJECT_DESCRIPTION>",
    "projectLinks": ["<PROJECT_LINK_1>"]
}

rocket_info = {
    "projectName": "<PROJECT_NAME>",
    "launchDate": "<YYYY-MM-DDTHH:MM:SS.000Z>",
    "motorType": "<MOTOR_TYPE>",
    "altitude": {"target": "<TARGET_ALTITUDE>", "actual": "<ACTUAL_ALTITUDE>", "unit": "<UNIT>"},
    "payload": {"description": "<PAYLOAD_DESCRIPTION>", "payloadData": None, "weightGrams": "<WEIGHT_IN_GRAMS>"},
    "status": "<LAUNCH_STATUS>",
    "googleDriveLinks": ["<GOOGLE_DRIVE_LINK_1>"]
}

result = upload_rocket(project_info, rocket_info)
print("Uploaded IDs:", result)
```

---

### 2. Upload Rocket Motor Data (`upload_rocket_motor.py`)

#### Command Line Usage:
```bash
python Database/upload_rocket_motor.py --json Database/sample_rocket_motor.json
```

#### JSON File Format ([`sample_rocket_motor.json`](~/IITPKD-GS-Website/Database/sample_rocket_motor.json)):
```json
{
  "project_info": {
    "projectName": "<PROJECT_NAME>",
    "projectType": "Rocket Motor",
    "projectDescription": "<PROJECT_DESCRIPTION>",
    "projectLinks": [
      "<PROJECT_LINK_1>",
      "<PROJECT_LINK_2>"
    ]
  },
  "rocket_motor_info": {
    "projectName": "<PROJECT_NAME>",
    "projectData": {
      "Progress": "<PROGRESS_DESCRIPTION>",
      "Materials": {
        "Oxidizer": "<OXIDIZER_MATERIAL>",
        "Propellant": "<PROPELLANT_MATERIAL>",
        "Body Tube": "<BODY_TUBE_MATERIAL>",
        "Thermal lining": "<THERMAL_LINING_MATERIAL>"
      }
    },
    "projectStatus": "<PROJECT_STATUS>",
    "projectLinks": [
      "<PROJECT_LINK_1>",
      "<PROJECT_LINK_2>"
    ]
  }
}
```

#### Python Usage:
```python
from upload_rocket_motor import upload_rocket_motor

project_info = {
    "projectName": "<PROJECT_NAME>",
    "projectType": "Rocket Motor",
    "projectDescription": "<PROJECT_DESCRIPTION>",
    "projectLinks": ["<PROJECT_LINK_1>"]
}

motor_info = {
    "projectName": "<PROJECT_NAME>",
    "projectData": {
        "Progress": "<PROGRESS_DESCRIPTION>",
        "Materials": {
            "Oxidizer": "<OXIDIZER_MATERIAL>",
            "Propellant": "<PROPELLANT_MATERIAL>",
            "Body Tube": "<BODY_TUBE_MATERIAL>",
            "Thermal lining": "<THERMAL_LINING_MATERIAL>"
        }
    },
    "projectStatus": "<PROJECT_STATUS>",
    "projectLinks": ["<PROJECT_LINK_1>"]
}

result = upload_rocket_motor(project_info, motor_info)
print("Uploaded IDs:", result)
```

---

### 3. Upload Satellite Data (`upload_satellite.py`)

#### Command Line Usage:
```bash
python Database/upload_satellite.py --json Database/sample_satellite.json
```

#### JSON File Format ([`sample_satellite.json`](~/IITPKD-GS-Website/Database/sample_satellite.json)):
```json
{
  "project_info": {
    "projectName": "<PROJECT_NAME>",
    "projectType": "Satellite",
    "projectDescription": "<PROJECT_DESCRIPTION>",
    "projectLinks": [
      "<PROJECT_LINK_1>",
      "<PROJECT_LINK_2>"
    ]
  },
  "satellite_info": {
    "formFactor": "<FORM_FACTOR>",
    "massGrams": "<MASS_IN_GRAMS>",
    "deployment": {
      "targetAltitudeMeters": "<TARGET_ALTITUDE_IN_METERS>",
      "ejectionMechanism": "<EJECTION_MECHANISM>"
    },
    "recoverySystem": {
      "trackingMethod": "<TRACKING_METHOD>",
      "successfullyRecovered": false
    },
    "powerSystem": {
      "batteryType": "<BATTERY_TYPE>",
      "capacityMAh": "<CAPACITY_IN_MAH>"
    },
    "instruments": [
      "<INSTRUMENT_1>",
      "<INSTRUMENT_2>"
    ],
    "missionStatus": "<MISSION_STATUS>",
    "googleDriveLinks": [
      "<GOOGLE_DRIVE_LINK_1>"
    ]
  }
}
```

#### Python Usage:
```python
from upload_satellite import upload_satellite

project_info = {
    "projectName": "<PROJECT_NAME>",
    "projectType": "Satellite",
    "projectDescription": "<PROJECT_DESCRIPTION>",
    "projectLinks": ["<PROJECT_LINK_1>"]
}

satellite_info = {
    "formFactor": "<FORM_FACTOR>",
    "massGrams": "<MASS_IN_GRAMS>",
    "deployment": {"targetAltitudeMeters": "<TARGET_ALTITUDE_IN_METERS>", "ejectionMechanism": "<EJECTION_MECHANISM>"},
    "recoverySystem": {"trackingMethod": "<TRACKING_METHOD>", "successfullyRecovered": False},
    "powerSystem": {"batteryType": "<BATTERY_TYPE>", "capacityMAh": "<CAPACITY_IN_MAH>"},
    "instruments": ["<INSTRUMENT_1>", "<INSTRUMENT_2>"],
    "missionStatus": "<MISSION_STATUS>",
    "googleDriveLinks": ["<GOOGLE_DRIVE_LINK_1>"]
}

result = upload_satellite(project_info, satellite_info)
print("Uploaded IDs:", result)
```
