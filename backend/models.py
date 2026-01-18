from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    symptoms: List[str]
    history: List[str]
    bp: str
    temperature: str
    heart_rate: str

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(populate_by_name=True)

class AIRecommendation(BaseModel):
    patient_id: str
    possible_condition: str
    suggested_tests: List[str]
    dosage_recommendation: str
    precautionary_measures: List[str]
    ai_analysis_summary: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
