const BASE_URL = "http://localhost:5000";

export async function getPrescriptions(token) {
  const res = await fetch(`${BASE_URL}/prescriptions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}