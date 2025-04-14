import axios from "axios";

const API_BASE_URL =  "http://localhost:5000/api";

export const getUserBadges = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/badges/user/${userId}`);
    // console.log(response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching user badges:", error);
    throw error;
  }
};

export const getAllBadges = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/badges`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all badges:", error);
    throw error;
  }
};
