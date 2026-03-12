import apiClient from './api';

const symptomService = {
  checkSymptoms: async (symptoms, patientId) => {
    const response = await apiClient.post('/symptoms/check', { symptoms, patient_id: patientId });
    return response.data;
  }
};

export default symptomService;
