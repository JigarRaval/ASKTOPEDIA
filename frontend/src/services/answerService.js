import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/answers`;

export const postAnswer = async (answerData, token) => {
  const response = await axios.post(API_URL, answerData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMyAnswers = async (token) => {
  const res = await axios.get(`${API_URL}/my-answers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteMyAnswer = async (id, token) => {
  await axios.delete(`${API_URL}/my-answers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAnswersByQuestionId = async (questionId) => {
  const response = await axios.get(`${API_URL}/question/${questionId}`);
  return response.data;
};

// ✅ Upvote Answer
export const upvoteAnswer = async (id) => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/${id}/upvote`, {}, config);
  return response.data;
};

// ✅ Downvote Answer
export const downvoteAnswer = async (id) => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/${id}/downvote`, {}, config);
  return response.data;
};

// ✅ Accept Answer
export const acceptAnswer = async (id) => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/${id}/accept`, {}, config);
  return response.data;
};
