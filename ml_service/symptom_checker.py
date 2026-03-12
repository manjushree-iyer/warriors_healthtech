import re
import os
import json
import logging
from dataclasses import dataclass
from typing import List, Dict, Tuple
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("symptom_checker")

# Configure Groq
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = None
if GROQ_API_KEY:
    client = Groq(api_key=GROQ_API_KEY)
else:
    logger.warning("GROQ_API_KEY not found in environment. LLM features disabled.")

# ─────────────────────────────────────────────
# Data Structures
# ─────────────────────────────────────────────

@dataclass
class CheckResult:
    possible_conditions: List[str]
    triage: str                  # "Home Care" | "Consult Doctor" | "Emergency"
    confidence: float
    advice: str
    matched_symptoms: List[str]
    reasoning: str = ""          # Added for LLM insight


# ─────────────────────────────────────────────
# Knowledge Base
# ─────────────────────────────────────────────

SYMPTOM_ALIASES: Dict[str, str] = {
    # normalise common variations → canonical form
    "high temperature": "fever",
    "high temp": "fever",
    "running nose": "runny nose",
    "runny nose": "runny nose",
    "body ache": "body pain",
    "body aches": "body pain",
    "muscle ache": "body pain",
    "muscle pain": "body pain",
    "sore throat": "throat pain",
    "difficulty breathing": "breathlessness",
    "short of breath": "breathlessness",
    "shortness of breath": "breathlessness",
    "chest tightness": "chest pain",
    "loose motions": "diarrhea",
    "loose stool": "diarrhea",
    "loose stools": "diarrhea",
    "stomach ache": "abdominal pain",
    "stomach pain": "abdominal pain",
    "tummy pain": "abdominal pain",
    "passing out": "unconsciousness",
    "fainted": "unconsciousness",
    "fit": "seizure",
    "fits": "seizure",
    "convulsion": "seizure",
}

# condition → (required_symptoms_any, boost_symptoms, triage_level, advice)
CONDITIONS: Dict[str, Dict] = {
    "Common Cold": {
        "symptoms": {"runny nose", "sneezing", "sore throat", "mild fever", "cough"},
        "required_any": 2,
        "triage": "Home Care",
        "advice": "Rest, stay hydrated, take paracetamol for fever. Recover within 5-7 days.",
    },
    "Influenza (Flu)": {
        "symptoms": {"fever", "cough", "body pain", "fatigue", "headache", "chills"},
        "required_any": 3,
        "triage": "Consult Doctor",
        "advice": "Likely flu. Consult a doctor for antiviral medication. Rest and hydrate well.",
    },
    "COVID-19": {
        "symptoms": {"fever", "cough", "fatigue", "breathlessness", "loss of smell", "loss of taste"},
        "required_any": 3,
        "triage": "Consult Doctor",
        "advice": "Possible COVID-19. Get tested, isolate yourself, and consult a doctor.",
    },
    "Dengue Fever": {
        "symptoms": {"fever", "severe headache", "joint pain", "rash", "nausea", "eye pain"},
        "required_any": 3,
        "triage": "Consult Doctor",
        "advice": "Possible dengue. Avoid NSAIDs, drink plenty of fluids, see a doctor urgently.",
    },
    "Typhoid": {
        "symptoms": {"fever", "abdominal pain", "weakness", "diarrhea", "nausea", "headache"},
        "required_any": 3,
        "triage": "Consult Doctor",
        "advice": "Possible typhoid. Blood test needed. See a doctor for antibiotics.",
    },
    "Malaria": {
        "symptoms": {"fever", "chills", "sweating", "headache", "body pain", "nausea"},
        "required_any": 3,
        "triage": "Consult Doctor",
        "advice": "Possible malaria. Seek medical attention promptly for blood smear test.",
    },
    "Gastroenteritis": {
        "symptoms": {"nausea", "vomiting", "diarrhea", "abdominal pain", "fever"},
        "required_any": 2,
        "triage": "Home Care",
        "advice": "Stay hydrated with ORS. Avoid solid food for a few hours. See doctor if symptoms persist > 2 days.",
    },
    "Pneumonia": {
        "symptoms": {"fever", "cough", "breathlessness", "chest pain", "fatigue"},
        "required_any": 3,
        "triage": "Emergency",
        "advice": "Possible pneumonia. Seek immediate medical attention.",
    },
    "Heart Attack": {
        "symptoms": {"chest pain", "breathlessness", "sweating", "nausea", "arm pain"},
        "required_any": 2,
        "triage": "Emergency",
        "advice": "EMERGENCY: Could be cardiac event. Call ambulance immediately. Do not drive yourself.",
    },
    "Stroke": {
        "symptoms": {"sudden headache", "confusion", "vision loss", "weakness", "slurred speech"},
        "required_any": 2,
        "triage": "Emergency",
        "advice": "EMERGENCY: Possible stroke. Call ambulance immediately. Time is critical.",
    },
    "Appendicitis": {
        "symptoms": {"abdominal pain", "nausea", "vomiting", "fever", "loss of appetite"},
        "required_any": 3,
        "triage": "Emergency",
        "advice": "Possible appendicitis. Go to emergency department immediately.",
    },
    "Urinary Tract Infection": {
        "symptoms": {"burning urination", "frequent urination", "lower abdominal pain", "fever"},
        "required_any": 2,
        "triage": "Consult Doctor",
        "advice": "Likely UTI. See a doctor for antibiotics. Drink plenty of water.",
    },
    "Hypertension Crisis": {
        "symptoms": {"severe headache", "blurred vision", "chest pain", "nausea", "dizziness"},
        "required_any": 3,
        "triage": "Emergency",
        "advice": "EMERGENCY: Possible hypertensive crisis. Seek immediate care.",
    },
    "Asthma Attack": {
        "symptoms": {"breathlessness", "wheezing", "chest tightness", "cough"},
        "required_any": 2,
        "triage": "Emergency",
        "advice": "Asthma attack suspected. Use rescue inhaler. Seek emergency care if no relief.",
    },
}

# Hard-coded emergency red flags — override everything
EMERGENCY_RED_FLAGS: List[Tuple[str, str]] = [
    ("unconsciousness", "Patient is unconscious. CALL EMERGENCY SERVICES IMMEDIATELY."),
    ("seizure", "Seizure reported. CALL EMERGENCY SERVICES IMMEDIATELY."),
    ("breathlessness", "Severe breathing difficulty. Seek EMERGENCY care immediately."),
    ("chest pain", "Chest pain present. Rule out cardiac emergency — go to ER NOW."),
    ("heavy bleeding", "Significant bleeding reported. EMERGENCY care needed."),
    ("paralysis", "Possible paralysis. Stroke risk — EMERGENCY."),
]


# ─────────────────────────────────────────────
# Core Engine - Utilities
# ─────────────────────────────────────────────

def normalise(symptom: str) -> str:
    """Lowercase, strip, resolve aliases."""
    s = symptom.strip().lower()
    s = re.sub(r"\s+", " ", s)
    return SYMPTOM_ALIASES.get(s, s)


def parse_symptoms(raw: List[str]) -> List[str]:
    """Convert raw symptom list → normalised canonical list."""
    return list({normalise(s) for s in raw if s.strip()})


def check_red_flags(symptoms: List[str]) -> Tuple[bool, str]:
    for flag, msg in EMERGENCY_RED_FLAGS:
        if flag in symptoms:
            return True, msg
    return False, ""


def match_conditions(symptoms: List[str]) -> List[Tuple[str, float, str, str]]:
    """
    Returns list of (condition_name, confidence_score, triage, advice) sorted by score desc.
    """
    symptom_set = set(symptoms)
    results = []

    for condition, meta in CONDITIONS.items():
        overlap = symptom_set & meta["symptoms"]
        count = len(overlap)
        if count >= meta["required_any"]:
            # confidence = fraction of condition's symptoms matched
            confidence = count / len(meta["symptoms"])
            results.append((condition, round(confidence, 2), meta["triage"], meta["advice"]))

    # Sort by confidence descending, then by triage severity
    triage_order = {"Emergency": 0, "Consult Doctor": 1, "Home Care": 2}
    results.sort(key=lambda x: (triage_order[x[2]], -x[1]))
    return results


def determine_triage(matches: List[Tuple]) -> Tuple[str, str]:
    """Pick highest severity triage from matched conditions."""
    if not matches:
        return "Consult Doctor", "Symptoms unclear. Please consult a doctor for accurate diagnosis."
    top = matches[0]
    return top[2], top[3]


# ─────────────────────────────────────────────
# LLM Integration
# ─────────────────────────────────────────────

def check_symptoms_llm(symptoms: List[str]) -> CheckResult:
    """
    Calls Groq API to analyze symptoms.
    """
    if not GROQ_API_KEY:
        raise ValueError("Groq API key not configured")

    prompt = f"""
    You are a medical triage assistant for a rural telehealth system. 
    Analyze the following symptoms and provide a triage assessment.
    
    Symptoms: {', '.join(symptoms)}
    
    Return ONLY a JSON object with the following keys:
    - "possible_conditions": list of top 3 suspected conditions
    - "triage": one of ["Home Care", "Consult Doctor", "Emergency"]
    - "confidence": a float between 0.0 and 1.0
    - "advice": clear, concise patient advice
    - "reasoning": a brief explanation of why this triage level was chosen
    
    Constraint: 
    - If symptoms like chest pain, breathlessness, unconsciousness, or severe bleeding are present, triage MUST be "Emergency".
    - Be conservative: if unsure, lean towards "Consult Doctor".
    """

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful medical triage assistant that outputs JSON."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
        )
        
        # Extract response text
        text = chat_completion.choices[0].message.content
        data = json.loads(text)
        
        return CheckResult(
            possible_conditions=data.get("possible_conditions", ["Unspecified"]),
            triage=data.get("triage", "Consult Doctor"),
            confidence=float(data.get("confidence", 0.5)),
            advice=data.get("advice", "Please consult a professional."),
            matched_symptoms=symptoms,
            reasoning=data.get("reasoning", "")
        )

    except Exception as e:
        logger.error(f"LLM Prediction (Groq) failed: {e}")
        raise e


# ─────────────────────────────────────────────
# Main Entry Point
# ─────────────────────────────────────────────

def check_symptoms(raw_symptoms: List[str]) -> CheckResult:
    """
    Main entry point. 
    Prioritizes LLM reasoning, falls back to rule-based engine.
    """
    symptoms = parse_symptoms(raw_symptoms)

    # 1. ALWAYS check red flags first (Safety Override)
    is_emergency, emergency_msg = check_red_flags(symptoms)
    if is_emergency:
        return CheckResult(
            possible_conditions=["Potential Emergency Condition"],
            triage="Emergency",
            confidence=1.0,
            advice=emergency_msg,
            matched_symptoms=symptoms,
            reasoning="Critical red flag symptom detected."
        )

    # 2. Try LLM Reasoning
    if GROQ_API_KEY:
        try:
            logger.info("Attempting LLM-based symptom analysis (Groq)...")
            return check_symptoms_llm(symptoms)
        except Exception as e:
            logger.warning(f"Falling back to rule-based engine due to LLM error: {e}")

    # 3. Fallback: Rule-Based Engine
    logger.info("Using rule-based symptom analysis...")
    matches = match_conditions(symptoms)
    triage, advice = determine_triage(matches)
    conditions = [m[0] for m in matches[:3]] or ["Unspecified condition"]
    top_confidence = matches[0][1] if matches else 0.5

    return CheckResult(
        possible_conditions=conditions,
        triage=triage,
        confidence=top_confidence,
        advice=advice,
        matched_symptoms=symptoms,
        reasoning="Rule-based matching against known conditions."
    )