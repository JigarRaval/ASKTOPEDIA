import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [currentUserRole, setCurrentUserRole] = useState("admin"); // Simulate logged-in user role

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(
          "http://localhost:5000/api/admin/users"
        );
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = async (userId, role) => {
    if (currentUserRole !== "admin") {
      toast.error("Only admins can promote or demote users.");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}`, {
        role,
      });
      toast.success("User role updated successfully!");
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, role } : user))
      );
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (currentUserRole !== "admin") {
      toast.error("Only admins can delete users.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
        toast.success("User deleted successfully!");
        setUsers((prev) => prev.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user.");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "users") {
      return user.role === "user" && matchesSearch;
    } else if (activeTab === "admins") {
      return user.role === "admin" && matchesSearch;
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.h1
        className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Admin Panel
      </motion.h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <motion.button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 rounded-l-lg font-medium ${
            activeTab === "users"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-400"
          } transition duration-200`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Users
        </motion.button>

        <motion.button
          onClick={() => setActiveTab("admins")}
          className={`px-6 py-3 rounded-r-lg font-medium ${
            activeTab === "admins"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-400"
          } transition duration-200`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Admins
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <motion.input
          type="text"
          placeholder={`Search ${
            activeTab === "users" ? "users" : "admins"
          } by username or email...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-2/3 lg:w-1/2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* User/Admin Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <motion.div
            key={user._id}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {user.username}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              <p className="text-gray-500 dark:text-gray-400">
                Role:{" "}
                <span className="font-medium text-blue-500">{user.role}</span>
              </p>
            </div>

            <div className="flex gap-3">
              {user.role === "user" && currentUserRole === "admin" && (
                <motion.button
                  onClick={() => handleRoleChange(user._id, "admin")}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-transform duration-200 active:scale-95"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Promote to Admin
                </motion.button>
              )}
              {user.role === "admin" && currentUserRole === "admin" && (
                <motion.button
                  onClick={() => handleRoleChange(user._id, "user")}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-transform duration-200 active:scale-95"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Demote to User
                </motion.button>
              )}

              {currentUserRole === "admin" && (
                <motion.button
                  onClick={() => handleDeleteUser(user._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-transform duration-200 active:scale-95"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete User
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
