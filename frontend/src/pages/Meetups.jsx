import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createMeetup,
  updateMeetupStatus,
  fetchMeetupHistory,
  fetchUsers,
  updateMeetup,
} from "../services/meetupService";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Meetups = () => {
  const { user } = useAuth();
  const [meetups, setMeetups] = useState([]);
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMeetup, setNewMeetup] = useState({
    title: "",
    time: "",
    receiver: "",
    details: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editMeetup, setEditMeetup] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [meetupData, userData] = await Promise.all([
        fetchMeetupHistory(user._id),
        fetchUsers(),
      ]);

      const now = new Date();
      const upcoming = [];
      const past = [];

      meetupData.forEach((meetup) => {
        const meetupTime = new Date(meetup.time);
        if (meetupTime > now) {
          upcoming.push(meetup);
        } else {
          past.push(meetup);
        }
      });

      upcoming.sort((a, b) => new Date(a.time) - new Date(b.time));
      past.sort((a, b) => new Date(b.time) - new Date(a.time));

      setMeetups(upcoming);
      setHistory(past);

      setUsers(userData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const handleCreateMeetup = async () => {
    try {
      if (!newMeetup.title || !newMeetup.time || !newMeetup.receiver) {
        toast.error("Please fill all required fields!");
        return;
      }

      await createMeetup({
        ...newMeetup,
        requester: user._id,
      });

      toast.success("Meetup request sent successfully!");
      setShowModal(false);
      setNewMeetup({ title: "", time: "", receiver: "", details: "" });
      loadData();
    } catch (error) {
      toast.error("Failed to create meetup");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateMeetupStatus(id, status);
      toast.success(`Meetup ${status}`);
      loadData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleEditMeetup = async () => {
    try {
      if (!editMeetup.title || !editMeetup.time || !editMeetup.receiver) {
        toast.error("Please fill all required fields!");
        return;
      }

      await updateMeetup(editMeetup._id, editMeetup);
      toast.success("Meetup updated successfully!");
      setEditMeetup(null);
      loadData();
    } catch (error) {
      toast.error("Failed to update meetup");
    }
  };

  const getUserName = (userId) => {
    if (!userId) return "Unknown User";
    const userObj = users.find((u) => u._id === userId);

    return userObj ? userObj.username : "Unknown User";
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('/src/assets/texture.png')] bg-cover"></div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto p-6 relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-4xl font-extrabold text-center text-white mb-2 tracking-wider drop-shadow-lg">
            Meetups
          </h2>
          <p className="text-gray-400 text-center max-w-lg">
            Schedule and manage your meetings with other users
          </p>
        </div>

        {/* Create Meetup Button */}
        <div className="flex justify-center mb-8">
          <motion.button
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Meetup
          </motion.button>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === "upcoming"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === "history"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Meetups List */}
        <div className="space-y-4">
          {activeTab === "upcoming" ? (
            meetups.length > 0 ? (
              meetups.map((meetup) => (
                <motion.div
                  key={meetup._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {meetup.title}
                        </h3>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            meetup.status === "accepted"
                              ? "bg-green-900/50 text-green-400"
                              : meetup.status === "rejected"
                              ? "bg-red-900/50 text-red-400"
                              : "bg-yellow-900/50 text-yellow-400"
                          }`}
                        >
                          {meetup.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {new Date(meetup.time).toLocaleString()}
                        </div>

                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {meetup.requester?._id === user._id ? (
                            <>With {getUserName(meetup.receiver?._id)}</>
                          ) : (
                            <>With {getUserName(meetup.requester?._id)}</>
                          )}
                        </div>

                        {meetup.details && (
                          <div className="flex items-start gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="truncate">{meetup.details}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {meetup.status === "pending" &&
                      meetup.receiver?._id === user._id ? (
                        <>
                          <motion.button
                            onClick={() =>
                              handleStatusChange(meetup._id, "accepted")
                            }
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Accept
                          </motion.button>
                          <motion.button
                            onClick={() =>
                              handleStatusChange(meetup._id, "rejected")
                            }
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Reject
                          </motion.button>
                        </>
                      ) : null}

                      <motion.button
                        onClick={() => setEditMeetup(meetup)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-400 mb-2">
                  No upcoming meetups
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  You don't have any scheduled meetups yet. Create one to get
                  started!
                </p>
              </div>
            )
          ) : history.length > 0 ? (
            history.map((meetup) => (
              <motion.div
                key={meetup._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {meetup.title}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          meetup.status === "accepted"
                            ? "bg-green-900/50 text-green-400"
                            : "bg-red-900/50 text-red-400"
                        }`}
                      >
                        {meetup.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {new Date(meetup.time).toLocaleString()}
                      </div>

                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {meetup.requester?._id === user._id ? (
                          <>With {getUserName(meetup.receiver?._id)}</>
                        ) : (
                          <>With {getUserName(meetup.requester?._id)}</>
                        )}
                      </div>

                      {meetup.details && (
                        <div className="flex items-start gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="truncate">{meetup.details}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-xl font-medium text-gray-400 mb-2">
                No past meetups
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Your meetup history will appear here once you have completed
                some.
              </p>
            </div>
          )}
        </div>

        {/* Create Meetup Modal */}
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Schedule New Meetup
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Title*
                    </label>
                    <input
                      type="text"
                      placeholder="Meeting title"
                      value={newMeetup.title}
                      onChange={(e) =>
                        setNewMeetup({ ...newMeetup, title: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Date & Time*
                    </label>
                    <input
                      type="datetime-local"
                      value={newMeetup.time}
                      onChange={(e) =>
                        setNewMeetup({ ...newMeetup, time: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      With*
                    </label>
                    <select
                      value={newMeetup.receiver}
                      onChange={(e) =>
                        setNewMeetup({ ...newMeetup, receiver: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    >
                      <option value="">Select a user</option>
                      {users
                        .filter((u) => u._id !== user._id)
                        .map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Details
                    </label>
                    <textarea
                      placeholder="Meeting agenda or notes"
                      value={newMeetup.details}
                      onChange={(e) =>
                        setNewMeetup({ ...newMeetup, details: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateMeetup}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Schedule Meetup
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Meetup Modal */}
        {editMeetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Edit Meetup</h3>
                  <button
                    onClick={() => setEditMeetup(null)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Title*
                    </label>
                    <input
                      type="text"
                      placeholder="Meeting title"
                      value={editMeetup.title}
                      onChange={(e) =>
                        setEditMeetup({ ...editMeetup, title: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Date & Time*
                    </label>
                    <input
                      type="datetime-local"
                      value={editMeetup.time}
                      onChange={(e) =>
                        setEditMeetup({ ...editMeetup, time: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      With*
                    </label>
                    <select
                      value={editMeetup.receiver}
                      onChange={(e) =>
                        setEditMeetup({
                          ...editMeetup,
                          receiver: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    >
                      <option value="">Select a user</option>
                      {users
                        .filter((u) => u._id !== user._id)
                        .map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Details
                    </label>
                    <textarea
                      placeholder="Meeting agenda or notes"
                      value={editMeetup.details}
                      onChange={(e) =>
                        setEditMeetup({
                          ...editMeetup,
                          details: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setEditMeetup(null)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditMeetup}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Meetups;
