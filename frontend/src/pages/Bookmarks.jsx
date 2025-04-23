import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBookmark,
  FiSearch,
  FiX,
  FiChevronRight,
  FiTrash2,
  FiClock,
} from "react-icons/fi";

const Bookmarks = () => {
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

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

  const filteredQuestions = bookmarkedQuestions
    .filter((question) => {
      const matchesSearch =
        question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.content.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (question.category &&
          question.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  const categories = [
    "all",
    ...new Set(bookmarkedQuestions.map((q) => q.category).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 p-4">
        <div className="text-center max-w-md bg-gray-800/50 p-8 rounded-xl border border-gray-700/50">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
            {error.includes("login") ? "Authentication Required" : "Error"}
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            {error.includes("login")
              ? "You need to login to access your bookmarks"
              : error}
          </p>
          {error.includes("login") ? (
            <Link
              to="/login"
              className="px-6 py-3 inline-block text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:shadow-lg transition-all"
            >
              Go to Login
            </Link>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 inline-block text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
              Your Bookmarks
            </h1>
            <p className="text-lg text-gray-400">
              {bookmarkedQuestions.length} saved{" "}
              {bookmarkedQuestions.length === 1 ? "question" : "questions"}
            </p>
          </div>

          {bookmarkedQuestions.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FiX className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
                <button
                  onClick={clearAllBookmarks}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg border border-red-500/30 flex items-center gap-1"
                  title="Clear all bookmarks"
                >
                  <FiTrash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <div className="text-6xl mb-6 text-purple-400">
              <FiBookmark className="inline" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">
              {searchTerm
                ? "No matching bookmarks found"
                : "Your bookmark collection is empty"}
            </h2>
            <p className="text-gray-500 mb-6 max-w-md text-center">
              {searchTerm
                ? "Try a different search term or category"
                : "Start bookmarking questions to save them here for later"}
            </p>
            {!searchTerm && (
              <Link
                to="/home"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                Browse Questions <FiChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredQuestions.map((question) => (
                <motion.div
                  key={question._id}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/30 hover:shadow-lg transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <div className="flex justify-between items-start mb-3">
                    <Link
                      to={`/question/${question._id}`}
                      className="group-hover:text-purple-400 transition-colors"
                    >
                      <h2 className="text-xl font-semibold text-white">
                        {question.title}
                      </h2>
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() => setShowConfirmation(question._id)}
                        className="text-gray-400 hover:text-purple-400 transition-colors"
                        title="Remove bookmark"
                      >
                        <FiBookmark className="h-6 w-6 fill-current" />
                      </button>

                      {showConfirmation === question._id && (
                        <motion.div
                          className="absolute right-0 top-8 bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl z-10 w-48"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <p className="text-sm mb-2">Remove this bookmark?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleBookmark(question._id)}
                              className="px-3 py-1 text-sm bg-red-600/80 hover:bg-red-600 rounded flex-1"
                            >
                              Remove
                            </button>
                            <button
                              onClick={() => setShowConfirmation(null)}
                              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded flex-1"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {question.category && (
                    <span className="inline-block bg-purple-900/30 text-purple-400 text-xs px-2 py-1 rounded-full mb-3">
                      {question.category}
                    </span>
                  )}

                  <p className="text-gray-400 line-clamp-3 mb-4">
                    {question.content}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center">
                        {question.user?.username?.charAt(0).toUpperCase() ||
                          "U"}
                      </div>
                      <span className="truncate max-w-[120px]">
                        {question.user?.username || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock className="h-4 w-4" />
                      <span>
                        {new Date(question.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
