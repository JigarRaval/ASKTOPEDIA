import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
const Footer = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isAdminPage = location.pathname.includes("admin");
  return (
    <footer
      className={`w-full bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 shadow-sm ${
        isAdminPage && isMobile ? "pb-20" : ""
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-700 dark:text-gray-300 text-center md:text-left">
          © 2025{" "}
          <Link to="/" className="hover:underline font-semibold">
            Asktopedia
          </Link>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-col sm:flex-row items-center text-sm font-medium text-gray-700 dark:text-gray-300 gap-3 sm:gap-6">
          <li>
            <Link to="/about" className="hover:underline">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/terms" className="hover:underline">
              Terms & Conditions
            </Link>
          </li>
          <li>
            <Link to="/support" className="hover:underline">
              Contact Support
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
