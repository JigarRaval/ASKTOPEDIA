import { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import { getMyQuestions, deleteMyQuestion } from "../services/questionService";

const MyQuestions = () => {
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getMyQuestions(token);
        setQuestions(data);
      } catch (err) {
        toast.error("Failed to load questions");
      }
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  const deleteQuestion = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await deleteMyQuestion(id, token);
      setQuestions(questions.filter((q) => q._id !== id));
      toast.success("Question deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete question");
    }
  };

  const handleDelete = async (id) => {
    toast(
      <div>
        <p>Are you sure you want to delete this question?</p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => {
              toast.dismiss(); // Dismiss the toast
              deleteQuestion(id); // Proceed with deletion
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss()} // Dismiss the toast
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false, // Prevent auto-closing
        closeButton: false, // Hide the default close button
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <ToastContainer /> {/* Add this line */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">
          📌 My Questions
        </h1>

        {loading && (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Loading...
          </p>
        )}

        {!loading && questions.length === 0 && (
          <p className="text-gray-700 dark:text-gray-300 text-center">
            No questions found.
          </p>
        )}

        <ul className="space-y-6">
          {questions.map((question) => (
            <li
              key={question._id}
              className="p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
            >
              {/* Background Texture */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-200 dark:to-gray-700 opacity-10 pointer-events-none"></div>

              {/* Content Layout */}
              <div className="flex justify-between items-center">
                <div className="w-4/5">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {question.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                    {question.description}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(question._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all shadow-md hover:scale-105 transform"
                >
                  ❌ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyQuestions;
