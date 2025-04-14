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

  useEffect(() => {
    loadData();
  }, []);

  // Load meetups, history, and users
  const loadData = async () => {
    try {
      const [meetupData, userData] = await Promise.all([
        fetchMeetupHistory(user._id),
        fetchUsers(),
      ]);

      // Separate upcoming meetups and history
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

      // Sort upcoming meetups by time (latest first)
      upcoming.sort((a, b) => new Date(b.time) - new Date(a.time));

      setMeetups(upcoming);
      setHistory(past);
      setUsers(userData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  // Create new meetup
  const handleCreateMeetup = async () => {
    try {
      if (!newMeetup.title || !newMeetup.time || !newMeetup.receiver) {
        toast.error("Please fill all fields!");
        return;
      }

      await createMeetup({
        ...newMeetup,
        requester: user._id,
      });

      toast.success("Meetup request sent!");
      setShowModal(false);
      setNewMeetup({ title: "", time: "", receiver: "", details: "" });
      loadData();
    } catch (error) {
      toast.error("Failed to create meetup");
    }
  };

  // Update meetup status (accept/reject)
  const handleStatusChange = async (id, status) => {
    try {
      await updateMeetupStatus(id, status);
      toast.success(`Meetup ${status}`);
      loadData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Edit meetup
  const handleEditMeetup = async () => {
    try {
      if (!editMeetup.title || !editMeetup.time || !editMeetup.receiver) {
        toast.error("Please fill all fields!");
        return;
      }

      await updateMeetup(editMeetup._id, editMeetup);
      toast.success("Meetup updated!");
      setEditMeetup(null);
      loadData();
    } catch (error) {
      toast.error("Failed to update meetup");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <ToastContainer />
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('/src/assets/texture.png')] bg-cover"></div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto p-6 relative z-10"
      >
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-wider drop-shadow-lg">
          🚀 Meetups
        </h2>

        {/* Create Meetup Button */}
        <div className="flex justify-center mb-8">
          <motion.button
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl"
          >
            + Create Meetup
          </motion.button>
        </div>

        {/* Upcoming Meetups */}
        <div className="space-y-6 mb-12">
          <h3 className="text-2xl font-bold text-white mb-4">
            Upcoming Meetups
          </h3>
          {meetups.length > 0 ? (
            meetups.map((meetup) => (
              <motion.div
                key={meetup._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-6 bg-white/20 dark:bg-gray-800/40 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {meetup.title}
                </h3>
                <p className="text-gray-300 mb-1">
                  🕒 {new Date(meetup.time).toLocaleString()}
                </p>
                <p className="text-gray-400 mb-4">📋 {meetup.details}</p>

                <div className="flex items-center gap-4">
                  {meetup.status === "pending" &&
                  meetup.receiver?._id === user._id ? (
                    <>
                      <motion.button
                        onClick={() =>
                          handleStatusChange(meetup._id, "accepted")
                        }
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      >
                        ✅ Accept
                      </motion.button>
                      <motion.button
                        onClick={() =>
                          handleStatusChange(meetup._id, "rejected")
                        }
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        ❌ Reject
                      </motion.button>
                    </>
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        meetup.status === "accepted"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {meetup.status}
                    </span>
                  )}
                  <motion.button
                    onClick={() => setEditMeetup(meetup)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    ✏️ Edit
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No upcoming meetups.</p>
          )}
        </div>

        {/* History Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white mb-4">History</h3>
          {history.length > 0 ? (
            history.map((meetup) => (
              <motion.div
                key={meetup._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-6 bg-white/10  rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 border border-gray-700"
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {meetup.title}
                </h3>
                <p className="text-gray-300 mb-1">
                  🕒 {new Date(meetup.time).toLocaleString()}
                </p>
                <p className="text-gray-400 mb-4">📋 {meetup.details}</p>
                <span
                  className={`text-sm font-medium ${
                    meetup.status === "accepted"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {meetup.status}
                </span>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No past meetups.</p>
          )}
        </div>

        {/* Create Meetup Modal */}
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8 rounded-3xl shadow-2xl w-96 relative border border-gray-700"
            >
              <h3 className="text-2xl font-semibold mb-4 tracking-wider text-center">
                ✨ Create Meetup
              </h3>

              <input
                type="text"
                placeholder="Title"
                value={newMeetup.title}
                onChange={(e) =>
                  setNewMeetup({ ...newMeetup, title: e.target.value })
                }
                className="w-full p-3 mb-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 transition-all hover:shadow-md"
              />

              <input
                type="datetime-local"
                value={newMeetup.time}
                onChange={(e) =>
                  setNewMeetup({ ...newMeetup, time: e.target.value })
                }
                className="w-full p-3 mb-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 transition-all hover:shadow-md"
              />

              <select
                value={newMeetup.receiver}
                onChange={(e) =>
                  setNewMeetup({ ...newMeetup, receiver: e.target.value })
                }
                className="w-full p-3 mb-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 transition-all hover:shadow-md"
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Details"
                value={newMeetup.details}
                onChange={(e) =>
                  setNewMeetup({ ...newMeetup, details: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 transition-all hover:shadow-md"
              />

              <div className="flex justify-end gap-4 mt-6">
                <motion.button
                  onClick={() => setShowModal(false)}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#444444",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 px-4 py-2 rounded-lg border border-gray-500 hover:text-white transition-all"
                >
                  Cancel
                </motion.button>

                <motion.button
                  onClick={handleCreateMeetup}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 12px #4F46E5",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                  Create
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Meetup Modal */}
        {editMeetup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8 rounded-3xl shadow-2xl w-96 relative border border-gray-700"
            >
              <h3 className="text-2xl font-semibold mb-4 tracking-wider text-center">
                ✏️ Edit Meetup
              </h3>

              <input
                type="text"
                placeholder="Title"
                value={editMeetup.title}
                onChange={(e) =>
                  setEditMeetup({ ...editMeetup, title: e.target.value })
                }
                className="w-full p-3 mb-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 transition-all hover:shadow-md"
              />

              <input
                type="datetime-local"
                value={editMeetup.time}
                onChange={(e) =>
                  setEditMeetup({ ...editMeetup, time: e.target.value })
                }
                className="w-full p-3 mb-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 transition-all hover:shadow-md"
              />

              <select
                value={editMeetup.receiver}
                onChange={(e) =>
                  setEditMeetup({ ...editMeetup, receiver: e.target.value })
                }
                className="w-full p-3 mb-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 transition-all hover:shadow-md"
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Details"
                value={editMeetup.details}
                onChange={(e) =>
                  setEditMeetup({ ...editMeetup, details: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 transition-all hover:shadow-md"
              />

              <div className="flex justify-end gap-4 mt-6">
                <motion.button
                  onClick={() => setEditMeetup(null)}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#444444",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 px-4 py-2 rounded-lg border border-gray-500 hover:text-white transition-all"
                >
                  Cancel
                </motion.button>

                <motion.button
                  onClick={handleEditMeetup}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 12px #4F46E5",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Meetups;
