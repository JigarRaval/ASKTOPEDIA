import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;


export const loginUser = async (email, password) => {
  const response = await axios.post("http://localhost:5000/api/auth/login", {
    email,
    password,
  });
  localStorage.setItem("token", response.data.token); // ✅ Save token
  localStorage.setItem("user", JSON.stringify(response.data.user)); // ✅ Save user info
  return response.data;
};

export const registerUser = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, {
    username,
    email,
    password,
  });
  return response.data;
};
export const getUser = async () => {
  const response = await axios.get(`${API_URL}/auth/user`, {
    withCredentials: true,
  });
  return response.data;
};
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
// Add these new functions
export const requestPasswordReset = async (email) => {
  const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await axios.post(`${API_URL}/api/auth/reset-password`, { 
    token, 
    newPassword 
  });
  return response.data;
};
export const changePassword = async (currentPassword, newPassword) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/api/auth/change-password`,
    { currentPassword, newPassword },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const deleteAccount = async (password) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/api/auth/delete-account`,
    { password },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};