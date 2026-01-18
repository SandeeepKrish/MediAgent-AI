import json
import random
import datetime

def generate_bulk_data():
    names = ["Rahul Sharma", "Sneha Gupta", "Amit Patel", "Priya Singh", "Vikram Rao", "Anjali Verma", "Siddharth Malhotra", "Kavita Reddy", "Rohan Joshi", "Meera Nair"]
    symptoms_list = [
        ["fever", "cough", "fatigue"],
        ["headache", "blurred vision", "high bp"],
        ["excessive thirst", "frequent urination", "blurred vision"],
        ["wheezing", "shortness of breath", "chest tightness"],
        ["throbbing headache", "nausea", "sensitivity to light"]
    ]
    conditions = ["Common Cold", "Hypertension", "Diabetes Mellitus", "Asthma", "Migraine"]
    
    patients = []
    histories = []
    
    for i in range(100):
        # Generate Patient
        name = random.choice(names) + f" {i}"
        age = random.randint(18, 75)
        patient_id = f"p_{i}"
        
        patient = {
            "name": name,
            "age": age,
            "gender": random.choice(["Male", "Female"]),
            "symptoms": random.choice(symptoms_list),
            "history": ["none"],
            "bp": f"{random.randint(110, 150)}/{random.randint(70, 95)}",
            "temperature": f"{random.uniform(98, 102):.1f}°F",
            "heart_rate": f"{random.randint(65, 95)} bpm",
            "created_at": datetime.datetime.utcnow().isoformat()
        }
        patients.append(patient)
        
        # Generate corresponding History
        condition_idx = random.randint(0, 4)
        history = {
            "patient_name": name,
            "possible_condition": conditions[condition_idx],
            "suggested_tests": ["General Checkup", "Blood Test"],
            "dosage_recommendation": f"Standard {conditions[condition_idx]} protocol",
            "precautionary_measures": ["Rest", "Monitor Vitals"],
            "ai_analysis_summary": f"Automated analysis for {name} shows signs of {conditions[condition_idx]}.",
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
        histories.append(history)
        
    with open('c:/Users/asawd/OneDrive/Desktop/Agent-Ai/backend/data/patients.json', 'w') as f:
        json.dump(patients, f, indent=2)
        
    with open('c:/Users/asawd/OneDrive/Desktop/Agent-Ai/backend/data/history.json', 'w') as f:
        json.dump(histories, f, indent=2)

if __name__ == "__main__":
    generate_bulk_data()
    print("Generated patients.json and history.json in backend/data")
