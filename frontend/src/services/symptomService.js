import api from "./api";

/**
 * POST /symptoms/check
 * Body: { symptoms: string[] }
 * Forwards to ML service, logs result in DB.
 * Returns: { success, log, result: { possible_conditions, triage, confidence, advice, reasoning } }
 */
export const checkSymptoms = async (symptoms) => {
  const response = await api.post("/symptoms/check", { symptoms });
  return response.data;
};

/**
 * GET /symptoms/my-logs
 * Fetches symptom log history for the authenticated patient.
 */
export const getMySymptomLogs = async () => {
  const response = await api.get("/symptoms/my-logs");
  return response.data;
};

/**
 * GET /symptoms/logs/:patientId
 * Admin/doctor view of a specific patient's symptom logs.
 */
export const getPatientSymptomLogs = async (patientId) => {
  const response = await api.get(`/symptoms/logs/${patientId}`);
  return response.data;
};

/**
 * POST /prescriptions/
 * Body: { consultation_id, patient_id, pharmacy_id, medicine_name, dosage, instructions }
 * Doctor creates a prescription.
 */
export const createPrescription = async (data) => {
  const response = await api.post("/prescriptions/", data);
  return response.data;
};
