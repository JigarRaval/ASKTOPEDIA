import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRocket, FaGlobe, FaLightbulb, FaQuoteLeft } from "react-icons/fa";
import { SiTypescript, SiReact, SiNodedotjs } from "react-icons/si";

const LandingPage = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 overflow-hidden">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center px-6 md:px-24 pt-24 md:py-32 pb-16 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight"
          >
            Welcome to <span className="text-indigo-400">Asktopedia</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-xl text-gray-300 max-w-lg"
          >
            The ultimate platform for developers to collaborate, solve problems,
            and grow together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="flex flex-col sm:flex-row gap-10 w-full md:w-auto"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-lg font-medium transition shadow-lg shadow-indigo-500/30 w-full text-center"
              >
                Get Started
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="px-8 py-3   bg-transparent border-2 border-indigo-500 hover:bg-indigo-500/10 rounded-lg text-lg font-medium transition w-full text-center"
              >
                Login
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="flex items-center gap-4 mt-4"
          >
            <div className="flex -space-x-2">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                className="w-10 h-10 rounded-full border-2 border-indigo-500"
                alt="User"
              />
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                className="w-10 h-10 rounded-full border-2 border-indigo-500"
                alt="User"
              />
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                className="w-10 h-10 rounded-full border-2 border-indigo-500"
                alt="User"
              />
            </div>
            <p className="text-gray-400 text-sm">
              Join <span className="text-indigo-400 font-medium">100+</span>{" "}
              developers
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 flex justify-center relative"
        >
          <img
            className="w-full max-w-lg rounded-xl shadow-2xl border-4 border-indigo-500/20"
            src="/src/assets/landingPage.png"
            alt="Asktopedia Community"
          />
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-6 -left-6 bg-gray-800 p-4 rounded-lg shadow-lg border border-indigo-500/30"
          >
            <SiReact className="text-4xl text-indigo-400" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute -top-6 -right-6 bg-gray-800 p-4 rounded-lg shadow-lg border border-indigo-500/30"
          >
            <SiTypescript className="text-4xl text-indigo-400" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-6 md:px-12 py-12 bg-gray-800/50 rounded-xl my-8"
      >
        <h3 className="text-center text-gray-400 mb-6">
          TRUSTED BY DEVELOPERS WORLDWIDE
        </h3>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <SiTypescript className="text-5xl text-blue-400 opacity-80 hover:opacity-100 transition" />
          <SiReact className="text-5xl text-blue-400 opacity-80 hover:opacity-100 transition" />
          <SiNodedotjs className="text-5xl text-green-500 opacity-80 hover:opacity-100 transition" />
          <svg
            className="w-12 h-12 text-purple-400 opacity-80 hover:opacity-100 transition"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.723-4.042-1.608-4.042-1.608-.546-1.386-1.332-1.754-1.332-1.754-1.09-.744.083-.729.083-.729 1.205.085 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.776.42-1.305.763-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.468-2.382 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.956-.266 1.98-.4 3-.405 1.02.005 2.044.139 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.768.838 1.234 1.91 1.234 3.22 0 4.61-2.805 5.625-5.476 5.922.43.372.824 1.102.824 2.222 0 1.604-.015 2.896-.015 3.29 0 .322.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 md:px-12 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          Why Choose <span className="text-indigo-400">Asktopedia</span>?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto"
        >
          Our platform is designed to help developers at every level grow their
          skills and connect with peers.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -10 }}
            className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all border border-gray-700 hover:border-indigo-500/30"
          >
            <div className="bg-indigo-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <FaRocket className="text-2xl text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">
              Lightning Fast Answers
            </h3>
            <p className="text-gray-300">
              Get solutions to your coding problems in minutes from our active
              community of experienced developers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -10 }}
            className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all border border-gray-700 hover:border-indigo-500/30"
          >
            <div className="bg-indigo-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <FaGlobe className="text-2xl text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Global Network</h3>
            <p className="text-gray-300">
              Connect with developers from over 100 countries and expand your
              professional network.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ y: -10 }}
            className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all border border-gray-700 hover:border-indigo-500/30"
          >
            <div className="bg-indigo-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <FaLightbulb className="text-2xl text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Continuous Learning</h3>
            <p className="text-gray-300">
              Stay updated with the latest technologies and best practices
              through our knowledge base.
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full bg-gradient-to-r from-indigo-500/10 to-indigo-800/10 py-16 my-12 border-y border-indigo-500/20"
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div whileHover={{ scale: 1.05 }} className="p-6">
              <h3 className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">
                20+
              </h3>
              <p className="text-gray-400">Active Developers</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="p-6">
              <h3 className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">
                50+
              </h3>
              <p className="text-gray-400">Solutions Shared</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="p-6">
              <h3 className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">
                10+
              </h3>
              <p className="text-gray-400">Technologies Covered</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="p-6">
              <h3 className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">
                24/7
              </h3>
              <p className="text-gray-400">Community Support</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 md:px-12 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          What Our <span className="text-indigo-400">Community</span> Says
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto"
        >
          Don't just take our word for it - hear from developers who've
          transformed their careers.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-lg border border-gray-700"
          >
            <div className="flex items-start mb-6">
              <FaQuoteLeft className="text-2xl text-indigo-400 mr-4 mt-1" />
              <p className="text-gray-300 italic text-lg">
                "Asktopedia has been instrumental in my growth as a developer.
                The community's willingness to help and the quality of
                discussions are unmatched."
              </p>
            </div>
            <div className="flex items-center">
              <img
                src="https://randomuser.me/api/portraits/men/44.jpg"
                className="w-12 h-12 rounded-full border-2 border-indigo-500 mr-4"
                alt="Yash Nayak"
              />
              <div>
                <h4 className="font-semibold">Yash Nayak</h4>
                <p className="text-gray-400 text-sm">
                  Senior Frontend Developer
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-lg border border-gray-700"
          >
            <div className="flex items-start mb-6">
              <FaQuoteLeft className="text-2xl text-indigo-400 mr-4 mt-1" />
              <p className="text-gray-300 italic text-lg">
                "I landed my first developer job thanks to the mentorship I
                received on Asktopedia. The platform is perfect for both
                beginners and experts."
              </p>
            </div>
            <div className="flex items-center">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                className="w-12 h-12 rounded-full border-2 border-indigo-500 mr-4"
                alt="Shivam Yadav"
              />
              <div>
                <h4 className="font-semibold">Shivam Yadav</h4>
                <p className="text-gray-400 text-sm">Fullstack Developer</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full bg-gradient-to-r from-indigo-600/20 to-indigo-800/20 py-16 my-12 rounded-2xl"
      >
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our{" "}
            <span className="text-indigo-400">Developer Community</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Start collaborating with developers worldwide and take your skills
            to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/register"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 rounded-xl text-lg font-medium transition w-full block"
              >
                Get Started For Free
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/login"
                className="px-8 py-4 bg-transparent border-2 border-indigo-500 hover:bg-indigo-500/10 rounded-xl text-lg font-medium transition w-full block"
              >
                Existing Account
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default LandingPage;
