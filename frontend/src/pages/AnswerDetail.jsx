import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const AnswerDetail = () => {
  const { id } = useParams(); // The answer ID from the route
  const [answer, setAnswer] = useState(null);
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchAnswerDetails = async () => {
      try {
        const answerResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/answers/${id}`
        );
        setAnswer(answerResponse.data);
        setQuestion(answerResponse.data.question); // Assuming answer has question details
        setComments(answerResponse.data.comments || []); // Assuming answer has comments array
      } catch (err) {
        setError("❌ Error fetching answer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnswerDetails();
  }, [id]);

  const handleVote = async (type) => {
    try {
      const updatedAnswer =
        type === "upvote"
          ? await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/answers/${id}/upvote`
            )
          : await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/answers/${id}/downvote`
            );

      setAnswer(updatedAnswer.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to vote");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to add a comment.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/comments`,
        { answerId: id, text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => [...prev, response.data]);
      setNewComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add comment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-20 w-full bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : answer ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Answer Details</h1>
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300">{answer.text}</p>
              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={() => handleVote("upvote")}
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                >
                  <FaArrowUp /> {answer.upvotes} Upvotes
                </button>
                <button
                  onClick={() => handleVote("downvote")}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600"
                >
                  <FaArrowDown /> {answer.downvotes} Downvotes
                </button>
                <span>Answered by: {answer.user?.username || "Anonymous"}</span>
              </div>
            </div>

            <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
              <h2 className="text-xl font-semibold mb-2">
                Associated Question:
              </h2>
              {question && (
                <div>
                  <h3 className="text-lg font-medium">{question.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {question.description}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Comments</h2>
              {comments.length === 0 ? (
                <p>No comments yet. Be the first to comment!</p>
              ) : (
                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <li key={comment._id}>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p>{comment.text}</p>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          - {comment.user?.username || "Anonymous"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <form onSubmit={handleAddComment} className="mt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700"
                  placeholder="Add your comment here..."
                />
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Submit Comment
                </button>
              </form>
            </div>
          </>
        ) : (
          <p>Answer not found.</p>
        )}
      </div>
    </div>
  );
};

export default AnswerDetail;
