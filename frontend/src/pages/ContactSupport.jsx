import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from backend
        if (data.errors) {
          throw new Error(data.errors.join(", "));
        }
        throw new Error(data.message || "Failed to send message");
      }

      toast.success(data.message || "Your message has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.message || "Failed to send your message. Please try again later."
      );
      toast.error(
        err.message || "❌ Failed to send your message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Field animations
  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 12 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4"
          >
            Contact Support
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-300 max-w-xl mx-auto"
          >
            Have a question or need assistance? Fill out the form below, and
            we'll get back to you as soon as possible.
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-8 space-y-6 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full -ml-20 -mb-20 blur-xl"></div>

          {/* Name */}
          <div className="relative">
            <label className="block text-gray-200 font-medium mb-2 text-sm">
              Your Name
            </label>
            <motion.div
              variants={inputVariants}
              whileFocus="focus"
              whileTap="focus"
              whileHover={{ scale: 1.01 }}
            >
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/70 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Enter your name"
                required
              />
            </motion.div>
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-gray-200 font-medium mb-2 text-sm">
              Your Email
            </label>
            <motion.div
              variants={inputVariants}
              whileFocus="focus"
              whileTap="focus"
              whileHover={{ scale: 1.01 }}
            >
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/70 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Enter your email"
                required
              />
            </motion.div>
          </div>

          {/* Subject */}
          <div className="relative">
            <label className="block text-gray-200 font-medium mb-2 text-sm">
              Subject
            </label>
            <motion.div
              variants={inputVariants}
              whileFocus="focus"
              whileTap="focus"
              whileHover={{ scale: 1.01 }}
            >
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/70 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Subject of your message"
                required
              />
            </motion.div>
          </div>

          {/* Message */}
          <div className="relative">
            <label className="block text-gray-200 font-medium mb-2 text-sm">
              Message
            </label>
            <motion.div
              variants={inputVariants}
              whileFocus="focus"
              whileTap="focus"
              whileHover={{ scale: 1.01 }}
            >
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 bg-gray-900/70 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Write your message here..."
                required
              />
            </motion.div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-300 bg-red-900/30 p-4 rounded-lg border border-red-700 text-sm"
            >
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
            }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-500 hover:to-purple-500 font-medium transition duration-300 flex justify-center items-center space-x-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                <span>Sending...</span>
              </>
            ) : (
              "Send Message"
            )}
          </motion.button>

          <p className="text-gray-400 text-xs text-center mt-4">
            We typically respond within 24-48 business hours.
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ContactSupport;
