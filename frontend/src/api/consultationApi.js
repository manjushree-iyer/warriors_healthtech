const BASE_URL = "http://localhost:5000";

export async function getConsultations(token) {
  const res = await fetch(`${BASE_URL}/consultations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}