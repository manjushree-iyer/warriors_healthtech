import apiClient from './api';

const appointmentService = {
  createAppointment: async (appointmentData) => {
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data;
  },

  getDoctorQueue: async () => {
    const response = await apiClient.get('/appointments/doctor/queue');
    return response.data;
  },

  startConsultation: async (consultationData) => {
    const response = await apiClient.post('/consultations/start', consultationData);
    return response.data;
  },

  getConsultationHistory: async (patientId) => {
    const response = await apiClient.get(`/consultations/${patientId}`);
    return response.data;
  },

  addDoctorNotes: async (notesData) => {
    const response = await apiClient.post('/consultations/notes', notesData);
    return response.data;
  }
};

export default appointmentService;
