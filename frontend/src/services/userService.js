import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const fetchUserProfile = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId, userData, token) => {
  const response = await axios.put(`${API_URL}/${userId}`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
