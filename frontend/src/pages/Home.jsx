import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getQuestions,
  upvoteQuestion,
  downvoteQuestion,
  toggleBookmark,
  getBookmarkedQuestions,
} from "../services/questionService";
import axios from "axios";
import Loader from "../components/Loader";
import {
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaFilter,
  FaSort,
  FaBookmark,
  FaRegBookmark,
  FaFire,
  FaTrophy,
  FaCommentAlt,
  FaEllipsisH,
} from "react-icons/fa";
import { motion } from "framer-motion";

// Top 10 technology tags to prioritize
const TOP_TECH_TAGS = [
  "javascript",
  "react",
  "nodejs",
  "python",
  "typescript",
  "html",
  "css",
  "mongodb",
  "express",
  "nextjs",
];

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);
  const [topContributors, setTopContributors] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Memoized filtered and sorted questions
  const filteredQuestions = useMemo(() => {
    return questions
      .filter((question) => {
        const matchesSearch =
          question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          question.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesTag = selectedTag
          ? question.tags.includes(selectedTag)
          : true;

        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === "latest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === "upvotes") {
          return b.upvotes - a.upvotes;
        } else if (sortBy === "answers") {
          return b.answers.length - a.answers.length;
        }
        return 0;
      });
  }, [questions, searchQuery, selectedTag, sortBy]);

  // Memoized pagination calculations
  const { currentQuestions, totalPages } = useMemo(() => {
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    return {
      currentQuestions: filteredQuestions.slice(
        indexOfFirstQuestion,
        indexOfLastQuestion
      ),
      totalPages: Math.ceil(filteredQuestions.length / questionsPerPage),
    };
  }, [filteredQuestions, currentPage, questionsPerPage]);

  // Memoized tags with top tech tags first, limited to 10
  const allTags = useMemo(() => {
    const tagCounts = {};
    questions.forEach((question) => {
      question.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Sort tags by count (descending) then alphabetically
    return Object.entries(tagCounts)
      .sort((a, b) => {
        // Prioritize top tech tags
        const aIsTop = TOP_TECH_TAGS.includes(a[0].toLowerCase());
        const bIsTop = TOP_TECH_TAGS.includes(b[0].toLowerCase());

        if (aIsTop && !bIsTop) return -1;
        if (!aIsTop && bIsTop) return 1;

        // Then sort by count
        if (b[1] !== a[1]) return b[1] - a[1];

        // Then alphabetically
        return a[0].localeCompare(b[0]);
      })
      .slice(0, 10) // Limit to top 10 tags
      .map(([tag]) => tag);
  }, [questions]);

  // Memoized trending questions
  const trendingQuestions = useMemo(() => {
    return [...questions].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);
  }, [questions]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [questionsData, bookmarksData, leaderboardData] =
          await Promise.all([
            getQuestions(),
            getBookmarkedQuestions(),
            axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/api/users/leaderboard`
            ),
          ]);

        setQuestions(questionsData);
        setBookmarkedQuestions(new Set(bookmarksData.map((q) => q._id)));
        setTopContributors(leaderboardData.data.slice(0, 5));
      } catch (err) {
        setError("❌ Failed to load data. Try again later.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
        setLeaderboardLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookmark = useCallback(async (id) => {
    try {
      const res = await toggleBookmark(id);
      setBookmarkedQuestions((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
      toast.success(res.message, { autoClose: 1500 });
    } catch (err) {
      toast.error("Failed to toggle bookmark");
    }
  }, []);

  const handleVote = useCallback(async (id, type) => {
    try {
      const updated =
        type === "upvote"
          ? await upvoteQuestion(id)
          : await downvoteQuestion(id);

      setQuestions((prev) =>
        prev.map((q) => (q._id === id ? updated.question : q))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to vote");
    }
  }, []);

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 md:mb-4"
          >
            Welcome to AskToPedia
          </motion.h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to your questions or share your knowledge with the
            community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content - Always first in DOM for mobile */}
          <div
            className={`lg:col-span-2 space-y-6 md:space-y-8 ${
              isMobileMenuOpen ? "hidden" : "block"
            }`}
          >
            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 transition-all"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1 min-w-[120px]">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FaFilter className="text-gray-400" />
                    </div>
                    <select
                      value={selectedTag}
                      onChange={(e) => {
                        setSelectedTag(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full appearance-none pl-3 pr-8 py-2 sm:py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 transition-all text-sm sm:text-base"
                    >
                      <option value="">All Tags</option>
                      {allTags.map((tag, index) => (
                        <option key={index} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FaSort className="text-gray-400" />
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="appearance-none pl-3 pr-8 py-2 sm:py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 transition-all text-sm sm:text-base"
                    >
                      <option value="latest">Latest</option>
                      <option value="upvotes">Upvotes</option>
                      <option value="answers">Answers</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Questions List */}
            {loading && (
              <div className="flex justify-center py-8 sm:py-12">
                <Loader size="lg" />
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center"
              >
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            {!loading && !error && (
              <div className="space-y-3 sm:space-y-4">
                {currentQuestions.length > 0 ? (
                  currentQuestions.map((question) => (
                    <motion.div
                      key={question._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            to={`/question/${question._id}`}
                            className="text-lg sm:text-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:underline line-clamp-2 flex-1"
                          >
                            {question.title}
                          </Link>
                          <button
                            onClick={() => handleBookmark(question._id)}
                            className="text-gray-400 hover:text-yellow-500 transition-colors flex-shrink-0"
                            aria-label="Bookmark"
                          >
                            {bookmarkedQuestions.has(question._id) ? (
                              <FaBookmark className="text-yellow-500" />
                            ) : (
                              <FaRegBookmark />
                            )}
                          </button>
                        </div>

                        <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2 sm:line-clamp-3 text-sm sm:text-base">
                          {question.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1 sm:gap-2">
                          {question.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300"
                            >
                              {tag}
                            </span>
                          ))}
                          {question.tags.length > 3 && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                              +{question.tags.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 sm:mt-4 flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
                            <button
                              onClick={() => handleVote(question._id, "upvote")}
                              className={`flex items-center gap-1 transition-colors ${
                                question.upvoted
                                  ? "text-indigo-600 dark:text-indigo-400"
                                  : "text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                              }`}
                              aria-label="Upvote"
                            >
                              <FaArrowUp />
                              <span>{question.upvotes}</span>
                            </button>
                            <button
                              onClick={() =>
                                handleVote(question._id, "downvote")
                              }
                              className={`flex items-center gap-1 transition-colors ${
                                question.downvoted
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                              }`}
                              aria-label="Downvote"
                            >
                              <FaArrowDown />
                              <span>{question.downvotes}</span>
                            </button>
                            <div className="flex items-center gap-1 text-gray-500">
                              <FaCommentAlt />
                              <span>{question.answers.length}</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(question.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 text-center"
                  >
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No questions found matching your criteria.
                    </p>
                    <Link
                      to="/ask"
                      className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Ask a Question
                    </Link>
                  </motion.div>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-6 sm:mt-8"
              >
                <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`relative inline-flex items-center px-3 sm:px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? "z-10 bg-indigo-600 border-indigo-600 text-white"
                              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() =>
                      paginate(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Toggleable on mobile */}
          <div
            className={`lg:space-y-8 ${
              isMobileMenuOpen ? "block" : "hidden lg:block"
            }`}
          >
            {/* Trending Questions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6 lg:mb-0"
            >
              <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <FaFire className="text-orange-500" />
                  Trending Questions
                </h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {trendingQuestions.length > 0 ? (
                  trendingQuestions.map((question) => (
                    <Link
                      key={question._id}
                      to={`/question/${question._id}`}
                      className="block p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <h3 className="font-medium text-indigo-600 dark:text-indigo-400 line-clamp-2 text-sm sm:text-base">
                        {question.title}
                      </h3>
                      <div className="mt-2 flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaArrowUp className="text-green-500" />
                          {question.upvotes} upvotes
                        </span>
                        <span>{question.answers.length} answers</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                    No trending questions
                  </div>
                )}
              </div>
            </motion.div>

            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6 lg:mb-0"
            >
              <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <FaTrophy className="text-yellow-500" />
                  Top Contributors
                </h2>
              </div>
              {leaderboardLoading ? (
                <div className="p-6 sm:p-8 flex justify-center">
                  <Loader size="sm" />
                </div>
              ) : topContributors.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {topContributors.map((contributor, index) => (
                    <div
                      key={contributor._id}
                      className={`p-3 sm:p-4 ${
                        index < 3
                          ? "bg-gradient-to-r from-transparent via-indigo-50/50 dark:via-gray-700/20 to-transparent"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div
                            className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${
                              index === 0
                                ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400"
                                : index === 1
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                : index === 2
                                ? "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400"
                                : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium truncate text-sm sm:text-base">
                            {contributor.username}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {contributor.points} points
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  No contributor data available
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold">Quick Actions</h2>
              </div>
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <Link
                  to="/ask"
                  className="block w-full text-center px-4 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  Ask a Question
                </Link>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag("");
                    setSortBy("latest");
                    setCurrentPage(1);
                  }}
                  className="block w-full text-center px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
