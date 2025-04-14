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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setError("❌ All fields are required.");
      toast.error("All fields are required.");
      return;
    }

    try {
      // Mock submission - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Your message has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      toast.error("❌ Failed to send your message. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 12 }}
        className="max-w-3xl mx-auto py-12 px-6"
      >
        <h1 className="text-3xl font-extrabold text-indigo-400 mb-6 text-center">
          Contact Support
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          Have a question or need assistance? Fill out the form below, and we'll
          get back to you as soon as possible.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-lg p-6 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Enter your email"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Subject of your message"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Write your message here..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 bg-red-800/30 p-3 rounded-lg border border-red-600">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full px-4 py-3 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-400 transition"
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactSupport;
