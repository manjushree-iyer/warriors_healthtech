import api from "./api";

/**
 * POST /api/appointments
 * Body: { doctor_id, scheduled_time }
 * Creates a new appointment for the authenticated patient.
 */
export const createAppointment = async (data) => {
  const response = await api.post("/api/appointments", data);
  return response.data;
};

/**
 * GET /api/doctor/queue
 * Returns all pending appointments for the authenticated doctor.
 */
export const getDoctorQueue = async () => {
  const response = await api.get("/api/doctor/queue");
  return response.data;
};

/**
 * POST /consultations/consultations/start
 * Body: { appointment_id, call_type }
 * Starts a consultation session.
 */
export const startConsultation = async (data) => {
  const response = await api.post("/consultations/consultations/start", data);
  return response.data;
};

/**
 * GET /consultations/consultations/:patientId
 * Fetches full consultation history for a patient.
 */
export const getConsultationHistory = async (patientId) => {
  const response = await api.get(`/consultations/consultations/${patientId}`);
  return response.data;
};

/**
 * POST /consultations/consultations/notes
 * Body: { consultation_id, doctor_notes }
 * Doctor writes notes for a consultation.
 */
export const addDoctorNotes = async (data) => {
  const response = await api.post("/consultations/consultations/notes", data);
  return response.data;
};
