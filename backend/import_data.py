import asyncio
import json
import os
from motor.motor_asyncio import AsyncIOMotorClient
from database import settings

async def import_data():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]
    
    # Paths
    patients_path = 'c:/Users/asawd/OneDrive/Desktop/Agent-Ai/backend/data/patients.json'
    history_path = 'c:/Users/asawd/OneDrive/Desktop/Agent-Ai/backend/data/history.json'
    
    # Import Patients
    if os.path.exists(patients_path):
        with open(patients_path, 'r') as f:
            patients = json.load(f)
            if patients:
                await db.patients.insert_many(patients)
                print(f"Imported {len(patients)} patients")
    
    # Import History
    if os.path.exists(history_path):
        with open(history_path, 'r') as f:
            history = json.load(f)
            if history:
                # User wants this in 'patient_history' collection
                await db.patient_history.insert_many(history)
                print(f"Imported {len(history)} history records")
                
    client.close()

if __name__ == "__main__":
    asyncio.run(import_data())
