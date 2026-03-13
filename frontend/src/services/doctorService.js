import api from "./api";

export const getAllDoctors = async () => {
  const response = await api.get("/doctors");
  return response.data;
};

export const getDoctorSchedule = async () => {
  const response = await api.get("/doctors/schedule");
  return response.data;
};

export const getTreatedPatients = async () => {
  const response = await api.get("/doctors/patients");
  return response.data;
};

export const getPatientHistory = async (patientId) => {
  const response = await api.get(`/doctors/patient-history/${patientId}`);
  return response.data;
};
