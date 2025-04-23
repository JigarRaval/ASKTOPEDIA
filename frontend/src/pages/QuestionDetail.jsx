import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  upvoteAnswer,
  downvoteAnswer,
  acceptAnswer,
  postAnswer,
} from "../services/answerService";
import { createReport, checkUserReport } from "../services/reportService";
import axios from "axios";
import {
  FaArrowUp,
  FaArrowDown,
  FaCheck,
  FaRegClock,
  FaComment,
  FaFlag,
} from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportingContent, setReportingContent] = useState({
    type: null,
    id: null,
  });
  const [userReports, setUserReports] = useState({
    questions: {},
    answers: {},
  });
  const [totalReports, setTotalReports] = useState({
    questions: {},
    answers: {},
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/questions/${id}`
        );
        setQuestion(response.data);
        setAnswers(response.data.answers || []);

        // Fetch report data if user is logged in
        if (token) {
          // Check if user reported the question
          const questionReport = await checkUserReport(
            "question",
            response.data._id,
            token
          );
          setUserReports((prev) => ({
            ...prev,
            questions: {
              ...prev.questions,
              [response.data._id]: questionReport.reported,
            },
          }));

          // Check reports for each answer
          const answerReports = {};
          for (const answer of response.data.answers || []) {
            const answerReport = await checkUserReport(
              "answer",
              answer._id,
              token
            );
            answerReports[answer._id] = answerReport.reported;
          }
          setUserReports((prev) => ({
            ...prev,
            answers: { ...prev.answers, ...answerReports },
          }));
        }
      } catch (err) {
        toast.error("Failed to fetch question.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id, token]);

  const formatDate = (dateString) => {
    if (!dateString) return "some time ago";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      console.error("Date formatting error:", e);
      return "some time ago";
    }
  };

  const handleVote = async (answerId, type) => {
    try {
      const updated =
        type === "upvote"
          ? await upvoteAnswer(answerId)
          : await downvoteAnswer(answerId);

      setAnswers((prev) =>
        prev
          .map((ans) => (ans._id === answerId ? updated.answer : ans))
          .sort((a, b) => b.upvotes - a.upvotes)
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to vote");
    }
  };

  const handleAccept = async (answerId) => {
    if (question.user._id !== user?._id) {
      toast.warn("Only the question's author can accept an answer.");
      return;
    }

    try {
      const updated = await acceptAnswer(answerId);
      setAnswers((prev) =>
        prev.map((ans) => ({
          ...ans,
          isAccepted: ans._id === answerId,
        }))
      );
      toast.success("Answer accepted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept answer");
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!newAnswer.trim()) {
      toast.error("Answer cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!token) {
        toast.error("You need to be logged in to post an answer.");
        return;
      }

      const response = await postAnswer(
        { questionId: id, text: newAnswer },
        token
      );
      const newAnswerObj = {
        ...response,
        _id: response._id || Date.now().toString(), // Ensure there's an ID
        text: newAnswer,
        user: {
          _id: user._id,
          username: user.username,
          verified: user.verified || false,
        },
        upvotes: 0,
        downvotes: 0,
        isAccepted: false,
        createdAt: new Date().toISOString(),
        reportCount: 0,
      };
      setAnswers((prev) =>
        [...prev, newAnswerObj].sort((a, b) => b.upvotes - a.upvotes)
      );
      setNewAnswer("");
      toast.success("Answer posted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openReportModal = async (type, id) => {
    if (!user) {
      toast.warn("You need to be logged in to report content.");
      return;
    }
    setReportingContent({ type, id });
    setShowReportModal(true);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    if (!reportReason) {
      toast.error("Please select a reason for reporting.");
      return;
    }

    try {
      const reportData = {
        reason: reportReason,
        description: reportDescription,
        [reportingContent.type]: reportingContent.id,
      };

      await createReport(reportData, token);

      // Update the user's report status
      setUserReports((prev) => ({
        ...prev,
        [reportingContent.type + "s"]: {
          ...prev[reportingContent.type + "s"],
          [reportingContent.id]: true,
        },
      }));

      // Update total reports count
      setTotalReports((prev) => ({
        ...prev,
        [reportingContent.type + "s"]: {
          ...prev[reportingContent.type + "s"],
          [reportingContent.id]:
            (prev[reportingContent.type + "s"][reportingContent.id] || 0) + 1,
        },
      }));

      toast.success("Report submitted successfully!");
      setShowReportModal(false);
      setReportReason("");
      setReportDescription("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    }
  };

  const getReportFlagColor = (contentType, contentId) => {
    if (userReports[contentType + "s"]?.[contentId]) {
      return "text-red-500 dark:text-red-400"; // User has reported this
    }
    if (totalReports[contentType + "s"]?.[contentId] > 0) {
      return "text-orange-500 dark:text-orange-400"; // Others have reported this
    }
    return "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"; // Default
  };

  const getReportTooltip = (contentType, contentId) => {
    const userReported = userReports[contentType + "s"]?.[contentId];
    const reportCount = totalReports[contentType + "s"]?.[contentId] || 0;

    if (userReported && reportCount > 1) {
      return `You and ${reportCount - 1} others reported this`;
    }
    if (userReported) {
      return "You reported this";
    }
    if (reportCount > 0) {
      return `${reportCount} user${reportCount > 1 ? "s" : ""} reported this`;
    }
    return "Report this content";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="mx-auto px-4 py-6 w-full max-w-7xl">
        <ToastContainer />

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Report {reportingContent.type}
              </h3>
              <form onSubmit={handleReportSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Reason for reporting
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="spam">Spam or advertisement</option>
                    <option value="harassment">
                      Harassment or hate speech
                    </option>
                    <option value="inappropriate">Inappropriate content</option>
                    <option value="misinformation">Misinformation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Additional details (optional)
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please provide more details..."
                    rows={3}
                    maxLength={500}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReportModal(false);
                      setReportReason("");
                      setReportDescription("");
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        ) : question ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Question Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {totalReports.questions[question._id] > 0 && (
                    <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                      {totalReports.questions[question._id]} report
                      {totalReports.questions[question._id] > 1 ? "s" : ""}
                    </span>
                  )}
                  <button
                    onClick={() => openReportModal("question", question._id)}
                    className={getReportFlagColor("question", question._id)}
                    title={getReportTooltip("question", question._id)}
                  >
                    <FaFlag />
                  </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  {question.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center">
                    <FaRegClock className="mr-1" />{" "}
                    {formatDate(question.createdAt)}
                  </span>
                  <span className="flex items-center">
                    <FaComment className="mr-1" />{" "}
                    {question.answers.length || 0} answers
                  </span>
                  <span>{question.upvotes} votes</span>
                </div>

                <div className="prose dark:prose-invert max-w-none mb-6">
                  {question.description}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Asked by{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        {question.user?.username}
                        {question.user?.verified && (
                          <MdOutlineVerified className="ml-1 text-blue-500" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Answers Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
                </h2>

                {answers.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No answers yet. Be the first to answer!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {answers.map((answer) => (
                      <div
                        key={answer._id}
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative ${
                          answer.isAccepted ? "ring-2 ring-green-500" : ""
                        }`}
                      >
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          {totalReports.answers[answer._id] > 0 && (
                            <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                              {totalReports.answers[answer._id]} report
                              {totalReports.answers[answer._id] > 1 ? "s" : ""}
                            </span>
                          )}
                          <button
                            onClick={() =>
                              openReportModal("answer", answer._id)
                            }
                            className={getReportFlagColor("answer", answer._id)}
                            title={getReportTooltip("answer", answer._id)}
                          >
                            <FaFlag />
                          </button>
                        </div>
                        <div className="prose dark:prose-invert max-w-none mb-4">
                          {answer.text}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 dark:border-gray-700 gap-3">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleVote(answer._id, "upvote")}
                              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              <FaArrowUp /> <span>{answer.upvotes}</span>
                            </button>
                            <button
                              onClick={() => handleVote(answer._id, "downvote")}
                              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                            >
                              <FaArrowDown /> <span>{answer.downvotes}</span>
                            </button>
                            {question.user._id === user?._id && (
                              <button
                                onClick={() => handleAccept(answer._id)}
                                className={`flex items-center gap-1 ${
                                  answer.isAccepted
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                                }`}
                              >
                                <FaCheck />{" "}
                                <span>
                                  {answer.isAccepted ? "Accepted" : "Accept"}
                                </span>
                              </button>
                            )}
                          </div>

                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Answered by{" "}
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {answer.user?.username || "Anonymous"}
                            </span>{" "}
                            • {formatDate(answer.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Answer Form */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Your Answer
                </h3>
                <form onSubmit={handleSubmitAnswer}>
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write a detailed answer..."
                    rows={8}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Posting..." : "Post Answer"}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Question Stats
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Asked
                    </span>
                    <span>{formatDate(question.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Views
                    </span>
                    <span>{question.views || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Answers
                    </span>
                    <span>{question.answers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Votes
                    </span>
                    <span>{question.upvotes}</span>
                  </div>
                  {totalReports.questions[question._id] > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Reports
                      </span>
                      <span className="text-red-500 dark:text-red-400">
                        {totalReports.questions[question._id]}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Related Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Question Not Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              The question you're looking for doesn't exist or may have been
              removed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;
