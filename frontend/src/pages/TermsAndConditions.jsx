import { useEffect } from "react";
import { motion } from "framer-motion";

const TermsAndConditions = () => {
  useEffect(() => {
    document.title = "Terms and Conditions - AskToPedia";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 12 }}
        className="max-w-4xl mx-auto py-12 px-6"
      >
        <h1 className="text-3xl font-extrabold text-indigo-400 mb-8 text-center">
          Terms and Conditions
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-lg p-6 space-y-6"
        >
          {/* Introduction */}
          <div>
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">
              1. Introduction
            </h2>
            <p className="leading-relaxed">
              Welcome to AskToPedia. By accessing our platform, you agree to
              abide by the terms and conditions outlined here. Please read them
              carefully.
            </p>
          </div>

          {/* User Responsibilities */}
          <div>
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">
              2. User Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                You are responsible for maintaining the confidentiality of your
                account.
              </li>
              <li>
                You agree to use the platform responsibly and not engage in
                harmful activities.
              </li>
              <li>
                You are responsible for the content you post and must ensure it
                complies with our guidelines.
              </li>
            </ul>
          </div>

          {/* Content Ownership */}
          <div>
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">
              3. Content Ownership
            </h2>
            <p className="leading-relaxed">
              By posting content on AskToPedia, you grant us a non-exclusive,
              royalty-free license to use, reproduce, and distribute your
              content.
            </p>
          </div>

          {/* Prohibited Activities */}
          <div>
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">
              4. Prohibited Activities
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Posting illegal, harmful, or misleading content.</li>
              <li>Harassment, abuse, or spamming other users.</li>
              <li>Attempting to gain unauthorized access to the platform.</li>
            </ul>
          </div>

          {/* Termination */}
          <div>
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">
              5. Termination
            </h2>
            <p className="leading-relaxed">
              We reserve the right to suspend or terminate your account if you
              violate these terms and conditions.
            </p>
          </div>

          {/* Disclaimer of Liability */}
          <div>
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">
              6. Disclaimer of Liability
            </h2>
            <p className="leading-relaxed">
              We are not liable for any content posted by users or any damage
              resulting from the use of the platform.
            </p>
          </div>

          {/* Changes to Terms */}
          <div>
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">
              7. Changes to Terms
            </h2>
            <p className="leading-relaxed">
              We may update these terms periodically. Continued use of the
              platform constitutes acceptance of the revised terms.
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">
              8. Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have any questions about these terms, please contact us at{" "}
              <a
                href="mailto:support@asktopedia.com"
                className="text-indigo-400 hover:underline"
              >
                support@asktopedia.com
              </a>
              .
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditions;
