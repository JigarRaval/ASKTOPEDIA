// services/reportService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const createReport = async (reportData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}/api/reports`,
    reportData,
    config
  );
  return response.data;
};

// Add to reportService.js
export const checkUserReport = async (contentType, contentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      [contentType]: contentId,
    },
  };

  const response = await axios.get(`${API_URL}/api/reports/check`, config);
  return response.data;
};
