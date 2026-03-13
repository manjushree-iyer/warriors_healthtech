const BASE_URL = "http://localhost:5000";

export async function getMedicines() {
  const res = await fetch(`${BASE_URL}/pharmacy`);
  return res.json();
}