import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          About <span className="text-indigo-400">Asktopedia</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Asktopedia is a dynamic community-driven platform for developers to
          ask questions, share knowledge, and grow together. Our mission is to
          build a **collaborative space** where tech enthusiasts can find
          solutions, network, and improve their skills.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        {[
          {
            title: "Collaborate",
            description:
              "Connect with like-minded developers and share innovative ideas.",
            icon: "🤝",
          },
          {
            title: "Learn & Grow",
            description:
              "Enhance your problem-solving skills by engaging in discussions.",
            icon: "📚",
          },
          {
            title: "Get Recognized",
            description:
              "Earn badges and reputation by contributing to the community.",
            icon: "🏆",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg text-center border border-gray-700 hover:border-indigo-400 transition"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-semibold">{feature.title}</h3>
            <p className="text-gray-300 mt-2">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-indigo-400">Meet Our Team</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mt-2">
          Our passionate team is dedicated to building a vibrant developer
          community.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {[
            {
              name: "Jigarkumar Raval",
              role: "Developer",
              img: "",
            },
          ].map((member, index) => {
            const firstLetter = member.name.charAt(0).toUpperCase();

            return (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-lg p-4 rounded-lg shadow-lg border border-gray-700 hover:border-indigo-400 transition"
              >
                <div
                  className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold border-4 ${
                    member.img
                      ? "border-indigo-500"
                      : "bg-indigo-500 text-white"
                  }`}
                >
                  {member.img ? (
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    firstLetter
                  )}
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-12"
      >
        <Link
          to="/register"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/50 rounded-lg text-lg font-medium transition"
        >
          Join Us Now
        </Link>
      </motion.div>
    </section>
  );
};

export default About;
