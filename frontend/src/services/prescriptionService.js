import api from "./api";

export const createPrescription = async (data) => {
  const response = await api.post("/prescriptions/", data);
  return response.data;
};

export const getMyPrescriptions = async () => {
  const response = await api.get("/prescriptions/me");
  return response.data;
};

export const getPharmacyPrescriptions = async (pharmacyId) => {
  const response = await api.get(`/prescriptions/pharmacy?pharmacy_id=${pharmacyId}`);
  return response.data;
};

export const updatePrescriptionStatus = async (id, status) => {
  const response = await api.put(`/prescriptions/${id}/status`, { status });
  return response.data;
};
