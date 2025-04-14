import React from "react";
import {
  FaHome,
  FaUsers,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6">
      <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-8">
        Admin Panel
      </h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <a
              href="#"
              className="flex items-center text-gray-800 dark:text-gray-200 hover:text-blue-500"
            >
              <FaHome className="mr-2" />
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center text-gray-800 dark:text-gray-200 hover:text-blue-500"
            >
              <FaUsers className="mr-2" />
              Users
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center text-gray-800 dark:text-gray-200 hover:text-blue-500"
            >
              <FaChartBar className="mr-2" />
              Analytics
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center text-gray-800 dark:text-gray-200 hover:text-blue-500"
            >
              <FaCog className="mr-2" />
              Settings
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center text-gray-800 dark:text-gray-200 hover:text-blue-500"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
