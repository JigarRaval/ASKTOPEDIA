import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { postQuestion, getQuestions } from "../services/questionService";
import { AuthContext } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowUp, FaArrowDown, FaCommentAlt, FaTags } from "react-icons/fa";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [trendingQuestions, setTrendingQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
const [suggestions, setSuggestions] = useState([]);
const [allQuestions, setAllQuestions] = useState([]);
const [tagSuggestions, setTagSuggestions] = useState([]);

useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const data = await getQuestions();
      const filteredQuestions = data
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, 3);
      setTrendingQuestions(filteredQuestions);
      setAllQuestions(data);
    } catch (err) {
      toast.error("Failed to load trending questions.");
    }
  };

  fetchQuestions();
}, []);
const handleTitleChange = (e) => {
  const input = e.target.value;
  setTitle(input);

  if (input.length > 1) {
    const matches = allQuestions.filter((q) =>
      q.title.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestions(matches.slice(0, 5)); // show top 5 matches
  } else {
    setSuggestions([]);
  }
};

const handleSuggestionClick = (suggestionTitle) => {
  setTitle(suggestionTitle);
  setSuggestions([]);
};
const handleTagsChange = (e) => {
  const input = e.target.value;
  setTags(input);

  const lastWord = input.split(",").pop().trim(); // get the last tag user is typing

  if (lastWord.length > 0) {
    const allTags = [...new Set(allQuestions.flatMap((q) => q.tags))];
    const matches = allTags.filter((tag) =>
      tag.toLowerCase().startsWith(lastWord.toLowerCase())
    );
    setTagSuggestions(matches.slice(0, 5)); // top 5 tag suggestions
  } else {
    setTagSuggestions([]);
  }
};
const handleTagSuggestionClick = (tag) => {
  const tagList = tags
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t);
  tagList.pop();
  tagList.push(tag);
  const uniqueTags = [...new Set(tagList)].slice(0, 5);
  setTags(uniqueTags.join(", ") + (uniqueTags.length < 5 ? ", " : ""));
  setTagSuggestions([]);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  if (!user) {
    toast.error("Please log in to ask a question.");
    setIsSubmitting(false);
    return;
  }

  const tagsArray = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag)
    .slice(0, 5);

  const questionData = {
    title,
    description,
    tags: tagsArray,
    user: user._id,
  };

  try {
    await postQuestion(questionData);
    toast.success("Question posted successfully!");
    setTitle("");
    setDescription("");
    setTags("");
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        "Failed to post question. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

const handleTagClick = (tag) => {
  if (!tags.includes(tag)) {
    setTags((prev) => (prev ? `${prev}${tag},` : `${tag},`));
  }
};

const popularTags = [...new Set(trendingQuestions.flatMap((q) => q.tags))]
  .map((tag) => ({
    name: tag,
    count: trendingQuestions.filter((q) => q.tags.includes(tag)).length,
  }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 5);

return (
  <div className="min-h-screen bg-gray-950 text-gray-100">
    {/* Toast Container */}
    <ToastContainer
      position="top-right"
      autoClose={3000}
      toastClassName="bg-gray-800 text-white"
      progressClassName="bg-gradient-to-r from-blue-500 to-purple-500"
    />

    {/* Hero Section */}
    <div className="relative bg-gradient-to-r from-purple-700 to-blue-700 py-20 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold mb-3"
        >
          Ask a Question
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-300 max-w-2xl mx-auto"
        >
          Get expert answers and help others in the community.
        </motion.p>
      </div>
    </div>

    {/* Main Content */}
    <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Ask Question Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-2 bg-gray-900 p-6 md:p-8 rounded-xl shadow-lg border border-gray-800"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            Ask Your Question
          </span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2 relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Question Title*
            </label>
            <input
              type="text"
              placeholder="What's your question? Be specific."
              value={title}
              onChange={handleTitleChange}
              required
              maxLength={150}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-md z-10 mt-1 overflow-hidden">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion._id}
                    onClick={() => handleSuggestionClick(suggestion.title)}
                    className="p-3 text-gray-300 hover:bg-gray-700 cursor-pointer text-sm"
                  >
                    {suggestion.title}
                  </div>
                ))}
              </div>
            )}
            <div
              className={`flex justify-between text-sm ${
                title.length >= 150 ? "text-red-400" : "text-gray-500"
              }`}
            >
              <span>Be specific and clear about your problem</span>
              <span>{title.length}/150</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Detailed Description*
            </label>
            <textarea
              placeholder="Describe your question in detail. Include code snippets if relevant."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength={2000}
              rows="8"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[200px]"
            />
            <div
              className={`flex justify-between text-sm ${
                description.length >= 2000 ? "text-red-400" : "text-gray-500"
              }`}
            >
              <span>The more details, the better answers you'll get</span>
              <span>{description.length}/2000</span>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2 relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              placeholder="e.g., react, javascript, nodejs"
              value={tags}
              onChange={(e) => handleTagsChange(e)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />

            {/* Suggest matching tags while typing */}
            {tagSuggestions.length > 0 && (
              <div className="absolute bg-gray-800 border border-gray-700 rounded-lg shadow-md z-10 mt-1 w-full overflow-hidden">
                {tagSuggestions.map((tag, index) => (
                  <div
                    key={index}
                    onClick={() => handleTagSuggestionClick(tag)}
                    className="p-3 text-gray-300 hover:bg-gray-700 cursor-pointer text-sm"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}

            <div className="text-sm text-gray-500 mt-1">
              Add up to 5 tags to categorize your question
            </div>

            {/* Popular Tags Section (unchanged) */}
            {popularTags.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-gray-400 mb-2 flex items-center">
                  <FaTags className="mr-2" /> Popular tags:
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag.name}
                      type="button"
                      onClick={() => handleTagClick(tag.name)}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                        tags.includes(tag.name)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all ${
              isSubmitting
                ? "bg-blue-700 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Posting...
              </span>
            ) : (
              "Post Question"
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Trending Questions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 p-6 md:p-8 rounded-xl shadow-lg border border-gray-800"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
          <span className="bg-gradient-to-r from-red-400 to-orange-400 text-transparent bg-clip-text">
            Trending Questions
          </span>
          <span className="ml-2 text-red-400">🔥</span>
        </h2>

        {trendingQuestions.length > 0 ? (
          <div className="space-y-4">
            {trendingQuestions.map((question, index) => (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-blue-500 transition-all"
              >
                <Link
                  to={`/question/${question._id}`}
                  className="text-lg font-semibold text-blue-400 hover:text-blue-300 transition-colors line-clamp-2"
                >
                  {question.title}
                </Link>
                <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                  {question.description}
                </p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-300">
                    <FaArrowUp className="text-green-400" />
                    <span>{question.upvotes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <FaArrowDown className="text-red-400" />
                    <span>{question.downvotes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <FaCommentAlt className="text-blue-400" />
                    <span>{question.answers?.length || 0}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {question.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No trending questions available
          </div>
        )}
      </motion.div>
    </div>
  </div>
);
};

export default AskQuestion;
