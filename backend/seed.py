import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import datetime

MONGO_URI = "mongodb+srv://Sandeep:Sandeep123@stock-cluster.skxwyn9.mongodb.net/AgenAi"
DB_NAME = "AgenticHMS"

async def seed_data():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    
    # Sample patients
    patients = [
        {
            "name": "Siddharth Sharma",
            "age": 45,
            "gender": "Male",
            "symptoms": ["headache", "high bp", "nosebleed"],
            "history": ["hypertension"],
            "bp": "160/100",
            "temperature": "98.4°F",
            "heart_rate": "88 bpm",
            "created_at": datetime.datetime.utcnow()
        },
        {
            "name": "Priya Singh",
            "age": 30,
            "gender": "Female",
            "symptoms": ["fever", "cough", "fatigue"],
            "history": ["none"],
            "bp": "110/70",
            "temperature": "101.2°F",
            "heart_rate": "92 bpm",
            "created_at": datetime.datetime.utcnow()
        }
    ]
    
    result = await db.patients.insert_many(patients)
    print(f"Inserted {len(result.inserted_ids)} patients")
    
    # Sample recommendations
    recommendations = [
        {
            "patient_id": str(result.inserted_ids[0]),
            "possible_condition": "Hypertension",
            "suggested_tests": ["ECG", "Blood Pressure Monitoring"],
            "dosage_recommendation": "Amlodipine 5mg (consult doctor)",
            "precautionary_measures": ["Reduce salt", "Relax", "Avoid caffeine"],
            "ai_analysis_summary": "Patient exhibits severe hypertensive symptoms. Immediate BP control required.",
            "timestamp": datetime.datetime.utcnow()
        },
        {
            "patient_id": str(result.inserted_ids[1]),
            "possible_condition": "Viral Fever",
            "suggested_tests": ["CBC", "Widal Test"],
            "dosage_recommendation": "Paracetamol 500mg (consult doctor)",
            "precautionary_measures": ["Rest", "Hydration", "Monitor temperature"],
            "ai_analysis_summary": "Classic signs of community-acquired viral infection.",
            "timestamp": datetime.datetime.utcnow()
        }
    ]
    
    await db.recommendations.insert_many(recommendations)
    print("Inserted sample recommendations")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
