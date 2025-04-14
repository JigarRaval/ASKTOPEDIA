import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Bookmarks = () => {
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(null);

  const userToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookmarkedQuestions = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/questions/bookmarks/all`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setBookmarkedQuestions(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookmarks");
        setLoading(false);
      }
    };

    if (userToken) {
      fetchBookmarkedQuestions();
    } else {
      setError("Please login to view your bookmarks");
      setLoading(false);
    }
  }, [userToken]);

  const handleToggleBookmark = async (questionId) => {
    try {
      await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/questions/${questionId}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setBookmarkedQuestions((prev) =>
        prev.filter((question) => question._id !== questionId)
      );
      setShowConfirmation(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update bookmark");
    }
  };

  const clearAllBookmarks = async () => {
    if (window.confirm("Are you sure you want to clear all bookmarks?")) {
      try {
        await Promise.all(
          bookmarkedQuestions.map((q) =>
            axios.put(
              `${import.meta.env.VITE_API_BASE_URL}/api/questions/${
                q._id
              }/bookmark`,
              {},
              { headers: { Authorization: `Bearer ${userToken}` } }
            )
          )
        );
        setBookmarkedQuestions([]);
      } catch (err) {
        setError("Failed to clear all bookmarks");
      }
    }
  };

  const filteredQuestions = bookmarkedQuestions.filter(
    (question) =>
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
            {error.includes("login") ? "Authentication Required" : "Error"}
          </h1>
          <p className="text-xl mb-6">
            {error.includes("login")
              ? "You need to login to access your bookmarks"
              : error}
          </p>
          {error.includes("login") ? (
            <Link
              to="/login"
              className="px-6 py-3 inline-block text-lg font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-500"
            >
              Go to Login
            </Link>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 inline-block text-lg font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-500"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
              Your Bookmarks
            </h1>
            <p className="text-lg text-gray-400">
              {bookmarkedQuestions.length} saved questions
            </p>
          </div>

          {bookmarkedQuestions.length > 0 && (
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                onClick={clearAllBookmarks}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg border border-red-500/30"
                title="Clear all bookmarks"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-6">🔖</div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-4">
              {searchTerm
                ? "No matching bookmarks found"
                : "Your bookmark collection is empty"}
            </h2>
            <p className="text-gray-500 mb-6 max-w-md text-center">
              {searchTerm
                ? "Try a different search term"
                : "Start bookmarking questions to save them here for later"}
            </p>
            {!searchTerm && (
              <Link
                to="/home"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg"
              >
                Browse Questions
              </Link>
            )}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredQuestions.map((question) => (
              <motion.div
                key={question._id}
                className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:border-purple-500/30 hover:shadow-lg transition-all"
                whileHover={{ scale: 1.02 }}
                layout
              >
                <div className="flex justify-between items-start mb-3">
                  <Link
                    to={`/questions/${question._id}`}
                    className="text-xl font-semibold text-white hover:text-purple-400"
                  >
                    {question.title}
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setShowConfirmation(question._id)}
                      className="text-gray-400 hover:text-purple-400"
                      title="Remove bookmark"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                    </button>

                    {showConfirmation === question._id && (
                      <div className="absolute right-0 top-8 bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl z-10 w-48">
                        <p className="text-sm mb-2">Remove this bookmark?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleBookmark(question._id)}
                            className="px-3 py-1 text-sm bg-red-600/80 hover:bg-red-600 rounded"
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => setShowConfirmation(null)}
                            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-400 line-clamp-3 mb-4">
                  {question.content}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="truncate max-w-[120px]">
                      {question.user?.username || "Unknown"}
                    </span>
                  </div>
                  <span>
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
