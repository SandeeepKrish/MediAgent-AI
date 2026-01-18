import json
import os
from typing import List, Dict

class MedicalAgent:
    def __init__(self, knowledge_base_path: str):
        self.knowledge_base_path = knowledge_base_path
        self.knowledge = self._load_knowledge()

    def _load_knowledge(self) -> List[Dict]:
        if os.path.exists(self.knowledge_base_path):
            try:
                with open(self.knowledge_base_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading knowledge base: {e}")
        return []

    def analyze_patient(self, patient_data: Dict) -> Dict:
        # Normalize incoming symptoms
        input_symptoms = [s.strip().lower() for s in patient_data.get('symptoms', []) if s.strip()]
        
        if not input_symptoms:
            return self._get_default_response("Please provide symptoms for analysis.")

        scored_matches = []
        
        for entry in self.knowledge:
            entry_symptoms = [s.lower() for s in entry['symptoms']]
            
            # Calculate intersection
            matches = set(input_symptoms) & set(entry_symptoms)
            match_count = len(matches)
            
            if match_count > 0:
                # Score = matches / total_condition_symptoms (higher specificity) 
                # + matches (higher absolute match)
                score = (match_count / len(entry_symptoms)) * 10 + match_count
                scored_matches.append({
                    "entry": entry,
                    "score": score,
                    "match_count": match_count
                })
        
        # Sort by score descending
        scored_matches.sort(key=lambda x: x['score'], reverse=True)
        
        if scored_matches:
            best = scored_matches[0]['entry']
            match_quality = scored_matches[0]['score']
            
            summary = f"Based on the reported symptoms ({', '.join(input_symptoms)}), the agent has identified characteristics highly consistent with {best['condition']}."
            if scored_matches[0]['match_count'] < len(input_symptoms):
                summary += " Some symptoms may require further specific investigation."

            return {
                "possible_condition": best['condition'],
                "suggested_tests": best['tests'],
                "dosage_recommendation": best['dosage'],
                "precautionary_measures": best['precautions'],
                "ai_analysis_summary": summary
            }
        else:
            return self._get_default_response()

    def _get_default_response(self, custom_msg=None) -> Dict:
        return {
            "possible_condition": "Undetermined Clinical Presentation",
            "suggested_tests": ["Complete Blood Count (CBC)", "Metabolic Panel", "General Vital Check"],
            "dosage_recommendation": "Maintain hydration. Consult a physician for a customized treatment plan.",
            "precautionary_measures": ["Monitor temperature", "Balanced diet", "Rest", "Avoid self-medication"],
            "ai_analysis_summary": custom_msg or "The provided symptoms do not clearly map to the current localized knowledge base. A comprehensive clinical examination is recommended."
        }

# Initialize the global agent
KB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "medical_knowledge.json")
medical_agent = MedicalAgent(KB_PATH)
