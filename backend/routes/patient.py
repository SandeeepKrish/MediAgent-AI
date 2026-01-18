from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_database
from models import PatientCreate, AIRecommendation
from ai.agent import medical_agent
from bson import ObjectId
from datetime import datetime
from typing import List

router = APIRouter(prefix="/api/patients", tags=["patients"])

@router.post("/", response_model=dict)
async def create_patient(patient: PatientCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    patient_dict = patient.model_dump() # Pydantic V2 use model_dump
    patient_dict["created_at"] = datetime.utcnow()
    
    # 1. Save to 'patients' collection
    result = await db.patients.insert_one(patient_dict)
    patient_id = str(result.inserted_id)
    
    # 2. Trigger AI Agent
    ai_analysis = medical_agent.analyze_patient(patient_dict)
    
    # 3. Save to 'patient_history' collection (as requested)
    history_rec = {
        "patient_id": patient_id,
        "patient_name": patient_dict["name"],
        "possible_condition": ai_analysis["possible_condition"],
        "suggested_tests": ai_analysis["suggested_tests"],
        "dosage_recommendation": ai_analysis["dosage_recommendation"],
        "precautionary_measures": ai_analysis["precautionary_measures"],
        "ai_analysis_summary": ai_analysis["ai_analysis_summary"],
        "timestamp": datetime.utcnow()
    }
    await db.patient_history.insert_one(history_rec)
    
    return {
        "patient_id": patient_id,
        "ai_recommendation": ai_analysis
    }

@router.get("/stats", response_model=dict)
async def get_stats(db: AsyncIOMotorDatabase = Depends(get_database)):
    total = await db.patients.count_documents({})
    male = await db.patients.count_documents({"gender": "Male"})
    female = await db.patients.count_documents({"gender": "Female"})
    
    # Critical based on BP (rough estimation in DB)
    # We can't easily parse "120/80" string in a simple count_documents without regex,
    # but for this demo, we'll just return the counts we have.
    return {
        "total": total,
        "male": male,
        "female": female
    }

@router.get("/", response_model=List[dict])
async def list_patients(db: AsyncIOMotorDatabase = Depends(get_database)):
    patients = await db.patients.find().sort("created_at", -1).to_list(1000)
    for p in patients:
        p["_id"] = str(p["_id"])
    return patients

@router.get("/{patient_id}", response_model=dict)
async def get_patient_details(patient_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    # Try getting patient from ID
    patient = await db.patients.find_one({"_id": ObjectId(patient_id)})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    patient["_id"] = str(patient["_id"])
    
    # Fetch recommendation from 'patient_history' instead of 'recommendations'
    recommendation = await db.patient_history.find_one({"patient_id": patient_id})
    if recommendation:
        recommendation["_id"] = str(recommendation["_id"])
        
    return {
        "patient": patient,
        "recommendation": recommendation
    }
