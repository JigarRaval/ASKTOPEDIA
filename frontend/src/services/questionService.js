import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/questions`;

export const postQuestion = async (questionData) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, questionData, config);
  return response.data;
};

export const getQuestions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get user's questions
export const getMyQuestions = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}/my-questions`, config);
  return res.data;
};

// Delete a question
export const deleteMyQuestion = async (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.delete(`${API_URL}/my-questions/${id}`, config);
  return res.data;
};

// ✅ Upvote Question
export const upvoteQuestion = async (id) => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/${id}/upvote`, {}, config);
  return response.data;
};

// ✅ Downvote Question
export const downvoteQuestion = async (id) => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/${id}/downvote`, {}, config);
  return response.data;
};
export const toggleBookmark = async (id) => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/${id}/bookmark`, {}, config);
  return response.data;
};
export const getBookmarkedQuestions = async () => {
  const token = localStorage.getItem("token"); // Assuming you save token in localStorage on login
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/questions/bookmarks/all`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

