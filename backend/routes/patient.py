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
    
    # Critical based on BP (approximate search for systolic > 140)
    # Since BP is stored as a string "120/80", we use a regex to find values > 140
    # For a production app, we should store numeric values separately.
    critical = 0
    async for patient in db.patients.find({}, {"bp": 1}):
        bp = patient.get("bp", "")
        if bp and "/" in bp:
            try:
                sys = int(bp.split("/")[0])
                if sys > 140:
                    critical += 1
            except:
                pass

    return {
        "total": total,
        "male": male,
        "female": female,
        "critical": critical
    }


@router.get("/", response_model=dict)
async def list_patients(page: int = 1, limit: int = 10, search: str = "", gender: str = "", critical: bool = False, db: AsyncIOMotorDatabase = Depends(get_database)):
    skip = (page - 1) * limit
    
    query = {}
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    
    if gender:
        query["gender"] = gender
        
    if critical:
<<<<<<< HEAD
        # Regex to find systolic readings > 140 (approximate for string format "120/80")
        # Matches patterns starting with 14[1-9], 1[5-9][0-9], or digits > 200
=======
>>>>>>> 084508b (Fix UI consistency across browsers and restore original font sizes while keeping new features)
        query["bp"] = {"$regex": "^(14[1-9]|1[5-9][0-9]|[2-9][0-9]{2})/"}
        
    total = await db.patients.count_documents(query)
    patients = await db.patients.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)

<<<<<<< HEAD

=======
>>>>>>> 084508b (Fix UI consistency across browsers and restore original font sizes while keeping new features)
    
    for p in patients:
        p["_id"] = str(p["_id"])
        
    return {
        "patients": patients,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }



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
