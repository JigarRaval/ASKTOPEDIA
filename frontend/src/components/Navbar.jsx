import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { logout } from "../services/authService";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-900 block w-full z-50 border-b border-gray-200 dark:border-gray-600">
      <div className="mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} className="h-8" alt="" />
          <span className="text-2xl font-semibold dark:text-white">
            AskToPedia
          </span>
        </Link>

        <div className="hidden md:flex items-center justify-between w-full pl-20 px-6">
          <ul className="flex space-x-6 text-gray-700 dark:text-gray-300 text-lg">
            <li>
              <Link
                to="/home"
                className={`hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive("/home")
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : ""
                }`}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/ask"
                className={`hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive("/ask")
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : ""
                }`}
              >
                Ask
              </Link>
            </li>
            <li>
              <Link
                to="/meetups"
                className={`hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive("/meetups")
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : ""
                }`}
              >
                Meetups
              </Link>
            </li>
            <li>
              <Link
                to="/badges"
                className={`hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive("/badges")
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : ""
                }`}
              >
                Badges
              </Link>
            </li>
            {user?.role === "admin" && (
              <li>
                <Link
                  to="/admin"
                  className={`hover:text-blue-600 dark:hover:text-blue-400 ${
                    isActive("/admin")
                      ? "text-blue-600 dark:text-blue-400 font-medium"
                      : ""
                  }`}
                >
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>

          <div className="flex items-center space-x-8 text-gray-300">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`hover:text-blue-600 dark:hover:text-blue-400 ${
                    isActive("/profile")
                      ? "text-blue-600 dark:text-blue-400 font-medium"
                      : ""
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`hover:text-blue-600 dark:hover:text-blue-400 ${
                    isActive("/login")
                      ? "text-blue-600 dark:text-blue-400 font-medium"
                      : ""
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 p-4 space-y-2">
          <ul className="flex flex-col space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <Link
                to="/home"
                className={`block py-2 px-3 rounded ${
                  isActive("/home")
                    ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/ask"
                className={`block py-2 px-3 rounded ${
                  isActive("/ask")
                    ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Ask
              </Link>
            </li>
            <li>
              <Link
                to="/meetups"
                className={`block py-2 px-3 rounded ${
                  isActive("/meetups")
                    ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Meetups
              </Link>
            </li>
            <li>
              <Link
                to="/badges"
                className={`block py-2 px-3 rounded ${
                  isActive("/badges")
                    ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Badges
              </Link>
            </li>
            {user?.role === "admin" && (
              <li>
                <Link
                  to="/admin"
                  className={`block py-2 px-3 rounded ${
                    isActive("/admin")
                      ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                      : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>

          <div className="mt-4 flex flex-col space-y-2 text-gray-300">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`block py-2 px-3 rounded ${
                    isActive("/profile")
                      ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                      : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`block py-2 px-3 rounded ${
                    isActive("/login")
                      ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                      : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
