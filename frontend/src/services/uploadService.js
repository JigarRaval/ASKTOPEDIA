import axios from "axios";

const uploadImage = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Send auth token
        },
        withCredentials: true, // Send cookies and auth headers
      }
    );

    return response.data.imageUrl;
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    throw new Error("Image upload failed");
  }
};

export { uploadImage };
