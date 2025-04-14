import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import error from "../assets/error.png";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-gray-300">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container flex flex-col md:flex-row items-center justify-between px-6 py-12"
      >
        {/* Left Section */}
        <div className="w-full lg:w-1/2 text-center md:text-left">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 100,
              damping: 12,
            }}
            className="text-[7rem] md:text-[8rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-blue-400 mb-6 leading-none"
          >
            404
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 100,
              damping: 10,
            }}
            className="text-2xl md:text-3xl font-medium leading-relaxed text-gray-400 mb-6"
          >
            Oops! We can't seem to find the page you're looking for.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/"
              className="px-6 py-3 inline-block text-lg font-medium text-white bg-purple-600/90 backdrop-blur-xl rounded-xl shadow-lg hover:bg-purple-500 hover:scale-105 transition-transform duration-300"
            >
              Back to Homepage
            </Link>
          </motion.div>
        </div>

        {/* Right Section (Image) */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 md:mt-0">
          <motion.img
            src={error}
            alt="Page not found"
            className="max-w-xs sm:max-w-md drop-shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
            whileHover={{
              scale: 1.05,
              rotate: 2,
              transition: { type: "spring", stiffness: 200, damping: 10 },
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
