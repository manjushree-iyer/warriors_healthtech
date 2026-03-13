import api from "./api";

/**
 * GET /pharmacy/search?medicine=<query>
 * Search for a medicine by name across all pharmacy inventories.
 */
export const searchMedicine = async (medicineName) => {
  const response = await api.get("/pharmacy/search", {
    params: { medicine: medicineName },
  });
  return response.data;
};

/**
 * POST /pharmacy/medicine
 * Body: { pharmacy_id, medicine_id, stock, price }
 * Add a medicine to a pharmacy's inventory.
 */
export const addMedicine = async (data) => {
  const response = await api.post("/pharmacy/medicine", data);
  return response.data;
};

/**
 * PUT /pharmacy/medicine/:id
 * Body: { stock }
 * Update stock count for an inventory item.
 */
export const updateStock = async (id, stock) => {
  const response = await api.put(`/pharmacy/medicine/${id}`, { stock });
  return response.data;
};

/**
 * GET /prescriptions/pharmacy?pharmacy_id=<id>
 * Fetch all prescriptions assigned to a pharmacy.
 */
export const getPharmacyPrescriptions = async (pharmacyId) => {
  const response = await api.get("/prescriptions/pharmacy", {
    params: { pharmacy_id: pharmacyId },
  });
  return response.data;
};

/**
 * PUT /prescriptions/:id/status
 * Body: { status }
 * Update prescription status (e.g., "dispensed", "pending").
 */
export const updatePrescriptionStatus = async (id, status) => {
  const response = await api.put(`/prescriptions/${id}/status`, { status });
  return response.data;
};
