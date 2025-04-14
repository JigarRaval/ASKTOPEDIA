import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getQuestions,
  upvoteQuestion,
  downvoteQuestion,
  toggleBookmark,
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
} from "react-icons/fa";
import { motion } from "framer-motion";

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
  const [bookmarked, setBookmarked] = useState([]);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (err) {
        setError("❌ Failed to load questions. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/leaderboard`
        );
        setTopContributors(response.data.slice(0, 5)); // Get top 5 contributors
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
        toast.error("Failed to load leaderboard data");
      } finally {
        setLeaderboardLoading(false);
      }
    };

    fetchQuestions();
    fetchLeaderboard();
  }, []);
   
  const handleBookmark = async (id) => {
    try {
      const res = await toggleBookmark(id);
      setBookmarked(res.bookmarks);
      toast.success(res.message);
    } catch (err) {
      toast.error("Failed to toggle bookmark");
    }
  };

  const handleVote = async (id, type) => {
    try {
      if (type === "upvote") {
        const updated = await upvoteQuestion(id);
        setQuestions((prev) =>
          prev.map((q) => (q._id === id ? updated.question : q))
        );
      } else {
        const updated = await downvoteQuestion(id);
        setQuestions((prev) =>
          prev.map((q) => (q._id === id ? updated.question : q))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to vote");
    }
  };

  const filteredQuestions = questions
    .filter((question) => {
      const matchesSearch =
        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.description.toLowerCase().includes(searchQuery.toLowerCase());

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

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const allTags = [...new Set(questions.flatMap((question) => question.tags))];

  const trendingQuestions = [...questions]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <ToastContainer />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Recent Questions
        </h1>

        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full p-3 pr-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
            >
              <option value="">All Tags</option>
              {allTags.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-3 pr-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
            >
              <option value="latest">Latest</option>
              <option value="upvotes">Most Upvotes</option>
              <option value="answers">Most Answers</option>
            </select>
            <FaSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center">
            <Loader />
          </div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}

        {!loading && !error && currentQuestions.length > 0 && (
          <div className="space-y-4">
            {currentQuestions.map((question) => (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-transform duration-300"
              >
                <Link
                  to={`/question/${question._id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {question.title}
                </Link>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {question.description.length > 100
                    ? question.description.substring(0, 100) + "..."
                    : question.description}
                </p>

                <div className="mt-2 flex items-center space-x-4 text-sm">
                  <button
                    onClick={() => handleVote(question._id, "upvote")}
                    className="flex items-center gap-1 hover:text-blue-500"
                  >
                    <FaArrowUp /> {question.upvotes}
                  </button>
                  <button
                    onClick={() => handleVote(question._id, "downvote")}
                    className="flex items-center gap-1 hover:text-red-500"
                  >
                    <FaArrowDown /> {question.downvotes}
                  </button>
                  <button
                    onClick={() => handleBookmark(question._id)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    {bookmarked.includes(question._id) ? (
                      <FaBookmark />
                    ) : (
                      <FaRegBookmark />
                    )}
                  </button>
                  <span>💬 {question.answers.length} Answers</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {question.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && currentQuestions.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No questions found.
          </div>
        )}

        {/* Pagination */}
        {filteredQuestions.length > questionsPerPage && (
          <div className="flex justify-center mt-8">
            {Array.from({
              length: Math.ceil(filteredQuestions.length / questionsPerPage),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 mx-1 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {/* Trending Questions Section */}
        {trendingQuestions.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">🔥 Trending Questions</h2>
            <div className="space-y-4">
              {trendingQuestions.map((question) => (
                <motion.div
                  key={question._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-transform duration-300"
                >
                  <Link
                    to={`/question/${question._id}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {question.title}
                  </Link>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {question.description.length > 100
                      ? question.description.substring(0, 100) + "..."
                      : question.description}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    <span>👍 {question.upvotes} Upvotes</span>
                    <span>💬 {question.answers.length} Answers</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Top Contributors Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">🏆 Top Contributors</h2>
          {leaderboardLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : topContributors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topContributors.map((contributor, index) => (
                <motion.div
                  key={contributor._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 ${
                    index === 0
                      ? "border-2 border-yellow-400"
                      : index === 1
                      ? "border-2 border-gray-400"
                      : index === 2
                      ? "border-2 border-orange-400"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold">
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : "🏅"}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {contributor.username}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {contributor.points} Points
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No contributor data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
