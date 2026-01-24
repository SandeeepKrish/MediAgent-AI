from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import motor.motor_asyncio
import os
from dotenv import load_dotenv

# 1. Loading Environment Variables
# Why? To securely manage sensitive data like MongoDB URIs and API keys without hardcoding them.
load_dotenv()

app = FastAPI(title="MediAgent-AI Core Backend")

# 2. Database Configuration (MongoDB with Motor)
# Why Motor? It's an asynchronous driver for MongoDB, perfect for FastAPI's async nature.
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client.medi_agent_db
patients_collection = db.patients

# 3. Pydantic Models for Data Validation
# Why Pydantic? It ensures that the data coming into our API matches the expected format,
# providing automatic error messages and documentation (Swagger).
class Patient(BaseModel):
    name: str
    age: int
    gender: str
    symptoms: List[str]
    bp: Optional[str] = "120/80"
    heart_rate: Optional[int] = 72

# 4. Mock AI Analysis Engine (Simulating LangChain)
# In a real scenario, this would call OpenAI or a local LLM via LangChain.
async def get_ai_diagnosis(patient: Patient):
    # This represents 'Agentic AI' - where the AI doesn't just predict, 
    # but follows a reasoning chain (RAG) to provide medical recommendations.
    symptoms_text = ", ".join(patient.symptoms)
    if "Chest Pain" in symptoms_text or (patient.heart_rate and patient.heart_rate > 100):
        return {
            "risk_level": "High",
            "suggestion": "Immediate ECG required. Possible cardiac distress.",
            "agent_thought": "Analyzed symptoms + vital signs. High heart rate detected."
        }
    return {
        "risk_level": "Low",
        "suggestion": "Routine checkup recommended. Monitor symptoms.",
        "agent_thought": "Symptoms appear mild. Vitals are within normal range."
    }

# 5. API Endpoints
@app.post("/api/patients")
async def create_patient(patient: Patient):
    # Step A: Perform AI Analysis
    ai_result = await get_ai_diagnosis(patient)
    
    # Step B: Prepare data for DB
    patient_dict = patient.dict()
    patient_dict["ai_analysis"] = ai_result
    
    # Step C: Save to MongoDB
    result = await patients_collection.insert_one(patient_dict)
    
    return {"id": str(result.inserted_id), "status": "Success", "ai_recommendation": ai_result}

@app.get("/api/patients")
async def get_all_patients():
    # Fetching history from DB
    cursor = patients_collection.find().sort("_id", -1).limit(10)
    patients = await cursor.to_list(length=10)
    for p in patients:
        p["_id"] = str(p["_id"])
    return patients

if __name__ == "__main__":
    import uvicorn
    # Why Uvicorn? It's a lightning-fast ASGI server that runs our FastAPI application.
    uvicorn.run(app, host="0.0.0.0", port=8000)
