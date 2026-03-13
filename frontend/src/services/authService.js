import api from "./api";

/**
 * POST /auth/register
 * Body: { name, email, password, role }
 * Roles: "patient" | "doctor" | "pharmacy"
 */
export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

/**
 * POST /auth/login
 * Body: { email, password }  OR  { abha_id, password }
 * Returns: { token, user: { id, name, role } }
 */
export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  const { token, user } = response.data;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  return response.data;
};

/**
 * GET /auth/me
 * Returns the currently authenticated user's profile.
 */
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

/**
 * Logout — clears localStorage
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Helper — get the stored user object
 */
export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};
