import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { uploadImage } from "../services/uploadService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    location: user?.location || "",
    bio: user?.bio || "",
    profileImage: user?.profileImage || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const imageUrl = await uploadImage(file, token);
        setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
        toast.success("✅ Image uploaded successfully!");
      } catch (error) {
        toast.error("❌ Failed to upload image.");
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser((prevUser) => ({
        ...prevUser,
        ...response.data,
      }));
      toast.success(" Profile updated successfully!");
    } catch (err) {
      toast.error(" Failed to update profile.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center p-6">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          ✏️ Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <label className="relative cursor-pointer">
              <img
                src={formData.profileImage || "/default-avatar.png"}
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600"
              />
              <input
                type="file"
                name="profileImage"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
            placeholder="Username"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
            placeholder="Location"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
            placeholder="Short Bio"
            rows="3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-3 text-white rounded-lg shadow-md"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  );
};

export default EditProfile;
