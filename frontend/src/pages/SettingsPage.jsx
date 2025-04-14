import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { uploadImage } from "../services/uploadService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaLock,
  FaImage,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaCog,
} from "react-icons/fa";

const SettingsPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    location: user?.location || "",
    bio: user?.bio || "",
    profileImage: user?.profileImage || "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

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
        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error("Failed to upload image.");
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      toast.error("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { newPassword, confirmPassword, ...updateData } = formData;

      if (newPassword) {
        updateData.password = newPassword;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${user._id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser((prev) => ({ ...prev, ...response.data }));
      toast.success("Settings updated successfully!");

      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      toast.error("Failed to update settings.");
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        localStorage.removeItem("token");
        window.location.href = "/";
      } catch (err) {
        toast.error("Failed to delete account.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center mb-6">
            <FaCog className="text-blue-500 mr-2 text-xl" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Account Settings
            </h1>
          </div>

          {/* Settings Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 font-medium ${
                activeTab === "profile"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 font-medium ${
                activeTab === "security"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Security
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center">
                  <FaUser className="text-blue-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Profile Information
                  </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Picture - Updated for consistent positioning */}
                  <div className="flex-shrink-0">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Profile Picture
                    </label>
                    <div className="relative inline-block">
                      <img
                        src={formData.profileImage || "/default-avatar.png"}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
                      />
                      <label className="absolute bottom-1 right-1 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition shadow-md">
                        <FaImage className="text-sm" />
                        <input
                          type="file"
                          name="profileImage"
                          onChange={handleImageChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      JPG, PNG (Max 2MB)
                    </p>
                  </div>

                  {/* Profile Fields */}
                  <div className="flex-grow space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full pl-10 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="flex items-center">
                  <FaLock className="text-blue-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Password & Security
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                      placeholder="Leave blank to keep current"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 mt-6 border-t border-red-200 dark:border-red-800">
                  <div className="flex items-center mb-4">
                    <FaInfoCircle className="text-red-500 mr-2" />
                    <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
                      Danger Zone
                    </h2>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-2 md:mb-0">
                        <h3 className="font-medium text-red-700 dark:text-red-300">
                          Delete Account
                        </h3>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          This will permanently delete all your data
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

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

export default SettingsPage;
