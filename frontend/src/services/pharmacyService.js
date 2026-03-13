import apiClient from './api';

const pharmacyService = {
  searchMedicine: async (medicine) => {
    const response = await apiClient.get(`/pharmacy/search?medicine=${medicine}`);
    return response.data;
  },

  addMedicine: async (medicineData) => {
    const response = await apiClient.post('/pharmacy/medicine', medicineData);
    return response.data;
  },

  updateStock: async (id, stock) => {
    const response = await apiClient.put(`/pharmacy/medicine/${id}`, { stock });
    return response.data;
  },

  createPrescription: async (prescriptionData) => {
    const response = await apiClient.post('/prescriptions', prescriptionData);
    return response.data;
  },

  getPharmacyPrescriptions: async (pharmacyId) => {
    const response = await apiClient.get(`/prescriptions/pharmacy?pharmacy_id=${pharmacyId}`);
    return response.data;
  },

  updatePrescriptionStatus: async (id, status) => {
    const response = await apiClient.put(`/prescriptions/${id}/status`, { status });
    return response.data;
  }
};

export default pharmacyService;
