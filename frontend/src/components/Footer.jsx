import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer
      className={`w-full p-4 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 shadow-sm `}
    >
      <div className="  flex flex-col md:flex-row items-center justify-between px-6 py-4">
        <span className="text-sm text-gray-700 dark:text-gray-300 sm:text-center">
          © 2025{" "}
          <Link to="/" className="hover:underline font-semibold">
            Asktopedia
          </Link>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-0">
          <li>
            <Link to="/about" className="hover:underline me-4 md:me-6">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/terms" className="hover:underline me-4 md:me-6">
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
