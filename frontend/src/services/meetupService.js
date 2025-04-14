import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL  ; 
// ✅ Create a meetup request
export const createMeetup = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/meetups/request`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating meetup:", error);
    throw error;
  }
};

// ✅ Update meetup status (Accept/Reject)
export const updateMeetupStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}/meetups/status/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating meetup status:", error);
    throw error;
  }
};

// ✅ Fetch meetup history for a user
export const fetchMeetupHistory = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/meetups/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching meetup history:", error);
    throw error;
  }
};
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/meetups/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const updateMeetup = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/meetups/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating meetup:", error);
    throw error;
  }
};