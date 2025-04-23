import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUsers,
  FaUserShield,
  FaFlag,
  FaSearch,
  FaTrash,
  FaUserEdit,
  FaUserTimes,
  FaUserCheck,
  FaEye,
  FaCheck,
  FaTimes,
  FaChartLine,
  FaHome,
  FaCog,
  FaSignOutAlt,
  FaCalendarAlt,
  FaIdCard,
  FaEnvelope,
  FaUserTag,
  FaUserCircle,
} from "react-icons/fa";
import { MdOutlineReport, MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    userCount: 0,
    adminCount: 0,
    reportCount: 0,
    activeUsers: 0,
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:5000/api/admin",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersResponse, reportsResponse, statsResponse] =
          await Promise.all([
            api.get("/users"),
            api.get("/reports"),
            api.get("/stats"),
          ]);
        setUsers(usersResponse.data);
        setReports(reportsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else {
          console.error("Error fetching admin data:", error);
          toast.error(
            error.response?.data?.message || "Failed to load admin data"
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/users/${userId}`, { role });
      toast.success(`User role updated to ${role}`);
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, role } : user))
      );
      // Update selected user if it's the one being modified
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, role });
      }
      const statsResponse = await api.get("/stats");
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error(
        error.response?.data?.message || "Failed to update user role."
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${userId}`);
        toast.success("User deleted successfully!");
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        const statsResponse = await api.get("/stats");
        setStats(statsResponse.data);
        setSelectedUser(null);
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error(error.response?.data?.message || "Failed to delete user.");
      }
    }
  };

  const handleResolveReport = async (reportId, action) => {
    try {
      if (action === "warn") {
        await api.post(`/reports/${reportId}/warn`);
      } else {
        await api.delete(`/reports/${reportId}`, { data: { action } });
      }
      toast.success("Report resolved successfully!");
      setReports((prev) => prev.filter((r) => r._id !== reportId));
      setSelectedReport(null);
      const statsResponse = await api.get("/stats");
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Failed to resolve report:", error);
      toast.error(error.response?.data?.message || "Failed to resolve report.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "users") return user.role === "user" && matchesSearch;
    if (activeTab === "admins") return user.role === "admin" && matchesSearch;
    return false;
  });

  const filteredReports = reports.filter(
    (report) =>
      report.reason.toLowerCase().includes(search.toLowerCase()) ||
      report.description?.toLowerCase().includes(search.toLowerCase())
  );

  const getReportContent = (report) => {
    if (report.question) return `Question: ${report.question.title}`;
    if (report.answer)
      return `Answer: ${report.answer.text.substring(0, 50)}...`;
    return "Content not available";
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <MdDashboard size={18} />,
      tab: "dashboard",
    },
    {
      name: "Users",
      icon: <FaUsers size={16} />,
      tab: "users",
    },
    {
      name: "Admins",
      icon: <FaUserShield size={16} />,
      tab: "admins",
    },
    {
      name: "Reports",
      icon: <MdOutlineReport size={18} />,
      tab: "reports",
      badge: reports.length > 0 ? reports.length : null,
    },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Users",
            value: stats.userCount,
            icon: <FaUsers className="text-blue-500" size={20} />,
            bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20",
            border: "border-blue-200 dark:border-blue-800",
          },
          {
            title: "Admins",
            value: stats.adminCount,
            icon: <FaUserShield className="text-green-500" size={20} />,
            bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/20",
            border: "border-green-200 dark:border-green-800",
          },

          {
            title: "Pending Reports",
            value: stats.reportCount,
            icon: <FaFlag className="text-red-500" size={20} />,
            bg: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/20",
            border: "border-red-200 dark:border-red-800",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${stat.bg} p-5 rounded-lg border ${stat.border} shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  {stat.title}
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {stat.change}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 shadow-sm">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Recent Users
            </h3>
            <button
              onClick={() => setActiveTab("users")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.slice(0, 5).map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.username}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Recent Reports
            </h3>
            <button
              onClick={() => setActiveTab("reports")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reports.slice(0, 5).map((report) => (
                  <tr
                    key={report._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {report.reason}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                        {getReportContent(report)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTable = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className={`lg:col-span-${selectedUser ? "2" : "3"}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        selectedUser?._id === user._id
                          ? "bg-blue-50 dark:bg-blue-900/10"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.username}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {user._id.substring(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            title="View Details"
                            aria-label="View Details"
                          >
                            <FaEye size={14} />
                          </button>
                          {user.role === "user" ? (
                            <button
                              onClick={() =>
                                handleRoleChange(user._id, "admin")
                              }
                              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                              title="Promote to Admin"
                              aria-label="Promote to Admin"
                            >
                              <FaUserCheck size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRoleChange(user._id, "user")}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              title="Demote to User"
                              aria-label="Demote to User"
                            >
                              <FaUserEdit size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete User"
                            aria-label="Delete User"
                          >
                            <FaUserTimes size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No users found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              User Details
            </h3>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close User Details"
            >
              <FaTimes size={14} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold mb-3">
                {selectedUser.username.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                {selectedUser.username}
              </h4>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  selectedUser.role === "admin"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                {selectedUser.role}
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: (
                    <FaIdCard className="text-gray-500 dark:text-gray-400" />
                  ),
                  label: "Username",
                  value: selectedUser.username,
                },
                {
                  icon: (
                    <FaEnvelope className="text-gray-500 dark:text-gray-400" />
                  ),
                  label: "Email",
                  value: selectedUser.email,
                },
                {
                  icon: (
                    <FaUserTag className="text-gray-500 dark:text-gray-400" />
                  ),
                  label: "Role",
                  value: selectedUser.role,
                  capitalize: true,
                },
                {
                  icon: (
                    <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
                  ),
                  label: "Account Created",
                  value: new Date(selectedUser.createdAt).toLocaleString(),
                },
                {
                  icon: (
                    <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
                  ),
                  label: "Last Updated",
                  value: new Date(selectedUser.updatedAt).toLocaleString(),
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      {item.label}
                    </h4>
                    <p
                      className={`text-sm text-gray-800 dark:text-gray-200 truncate ${
                        item.capitalize ? "capitalize" : ""
                      }`}
                      title={item.value}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {selectedUser.role === "user" ? (
                <button
                  onClick={() => handleRoleChange(selectedUser._id, "admin")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                >
                  <FaUserCheck size={12} /> Promote to Admin
                </button>
              ) : (
                <button
                  onClick={() => handleRoleChange(selectedUser._id, "user")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                >
                  <FaUserEdit size={12} /> Demote to User
                </button>
              )}
              <button
                onClick={() => handleDeleteUser(selectedUser._id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors"
              >
                <FaTrash size={12} /> Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderReportsTable = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className={`lg:col-span-${selectedReport ? "2" : "3"}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr
                      key={report._id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        selectedReport?._id === report._id
                          ? "bg-blue-50 dark:bg-blue-900/10"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {report.reason}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                          {getReportContent(report)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium">
                            {report.reporter?.username
                              ?.charAt(0)
                              .toUpperCase() || "A"}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {report.reporter?.username || "Anonymous"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            title="View Details"
                            aria-label="View Details"
                          >
                            <FaEye size={14} />
                          </button>
                          <button
                            onClick={() =>
                              handleResolveReport(report._id, "delete")
                            }
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete Content"
                            aria-label="Delete Content"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No reports found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedReport && (
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Report Details
            </h3>
            <button
              onClick={() => setSelectedReport(null)}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close Report Details"
            >
              <FaTimes size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Reason",
                value: selectedReport.reason,
                capitalize: true,
              },
              {
                label: "Description",
                value:
                  selectedReport.description ||
                  "No additional description provided.",
              },
              {
                label: "Reported Content",
                value: getReportContent(selectedReport),
              },
              {
                label: "Reported By",
                value: selectedReport.reporter?.username || "Anonymous",
              },
              {
                label: "Date Reported",
                value: new Date(selectedReport.createdAt).toLocaleString(),
              },
            ].map((item, index) => (
              <div key={index}>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  {item.label}
                </h4>
                <p
                  className={`text-sm text-gray-800 dark:text-gray-200 ${
                    item.capitalize ? "capitalize" : ""
                  }`}
                >
                  {item.value}
                </p>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <button
                onClick={() =>
                  handleResolveReport(selectedReport._id, "delete")
                }
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors"
              >
                <FaTrash size={12} /> Delete Content
              </button>
              <button
                onClick={() => handleResolveReport(selectedReport._id, "warn")}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-3 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors"
              >
                <FaCheck size={12} /> Warn User
              </button>
              <button
                onClick={() =>
                  handleResolveReport(selectedReport._id, "ignore")
                }
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors"
              >
                <FaTimes size={12} /> Ignore Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  Admin Panel
                </h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                      activeTab === item.tab
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                    {item.badge && (
                      <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <FaSignOutAlt size={14} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden  fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`p-3 flex flex-col items-center text-xs transition-colors ${
                activeTab === item.tab
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {item.icon}
              <span className="mt-1">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {activeTab === "dashboard" && "Dashboard Overview"}
                {activeTab === "users" && "User Management"}
                {activeTab === "admins" && "Admin Management"}
                {activeTab === "reports" && "Report Management"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeTab === "dashboard" && "System statistics and overview"}
                {activeTab === "users" && "Manage all registered users"}
                {activeTab === "admins" && "Manage administrator accounts"}
                {activeTab === "reports" && "Review and resolve user reports"}
              </p>
            </div>

            {activeTab !== "dashboard" && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" size={14} />
                </div>
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  aria-label={`Search ${activeTab}`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Loading data...
            </span>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && renderDashboard()}
            {(activeTab === "users" || activeTab === "admins") &&
              renderUsersTable()}
            {activeTab === "reports" && renderReportsTable()}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
