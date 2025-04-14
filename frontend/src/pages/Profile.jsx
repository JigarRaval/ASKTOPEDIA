import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  FiUser,
  FiMessageSquare,
  FiAward,
  FiSettings,
  FiActivity,
  FiMapPin,
  FiStar,
  FiBell,
  FiClock,
  FiTrendingUp,
  FiHelpCircle,
  FiBookmark,
} from "react-icons/fi";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    questionsAsked: 0,
    answersGiven: 0,
    badgesEarned: 0,
    reputation: 0,
    bookmarks: 0,
  });
  const [badges, setBadges] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch web development news from Dev.to API
  const fetchWebDevNews = async () => {
    try {
      const response = await axios.get(
        "https://dev.to/api/articles?tag=webdev&top=3"
      );
      return response.data.slice(0, 3).map((article) => ({
        id: article.id,
        title: article.title,
        url: article.url,
        date: article.published_at,
        readingTime: article.reading_time_minutes,
      }));
    } catch (err) {
      console.error("Error fetching web dev news:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setError("❌ Please log in to view your dashboard.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      try {
        // Set default user data first
        setUserData({
          username: user.username,
          email: user.email,
          location: user.location || "Not specified",
          points: user.points || 0,
          bio: user.bio || "No bio yet",
          profileImage: user.profileImage || "https://via.placeholder.com/150",
          field: user.field || "Developer",
          joinDate: user.createdAt || new Date().toISOString(),
        });

        // Try to fetch stats from API
        try {
          const statsResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/users/stats`,
            config
          );
          console.log(statsResponse.data);
          
          setStats(statsResponse.data);
        } catch (statsError) {
          console.warn("Could not fetch stats, using defaults:", statsError);
          setStats({
            questionsAsked: 0,
            answersGiven: 0,
            badgesEarned: 0,
            reputation: 0,
            bookmarks: 0,
          });
        }

        // Try to fetch badges from API
        try {
          const badgesResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/badges/user/${user._id}`,
            config
          );
          setBadges(badgesResponse.data);
        } catch (badgesError) {
          console.warn(
            "Could not fetch badges, using empty array:",
            badgesError
          );
          setBadges([]);
        }

        // Fetch web development news
        const newsData = await fetchWebDevNews();
        setAnnouncements(newsData);
      } catch (err) {
        console.error("Error in dashboard initialization:", err);
        setError(
          "Failed to load some dashboard data. Showing available information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg max-w-md text-center">
          <p className="text-red-400 mb-4">{error}</p>
          {!user ? (
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              Go to Login
            </Link>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <FiUser className="text-indigo-400" />
              Welcome, {userData.username}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar - Profile Summary */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-24 relative">
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-gray-800 shadow-lg object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                  <span className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-gray-800"></span>
                </div>
              </div>
            </div>

            <div className="pt-16 pb-6 px-6 text-center">
              <h2 className="text-xl font-bold">{userData.username}</h2>
              <p className="text-indigo-400 text-sm font-medium mt-1">
                {userData.field}
              </p>

              <div className="flex flex-col items-center mt-4 space-y-3">
                <div className="flex items-center text-sm">
                  <FiMapPin className="text-gray-400 mr-2" />
                  <span className="text-gray-300">{userData.location}</span>
                </div>

                <div className="flex items-center text-sm">
                  <FiStar className="text-yellow-400 mr-2" />
                  <span className="text-gray-300">
                    {userData.points} Reputation Points
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <FiClock className="text-gray-400 mr-2" />
                  <span className="text-gray-300">
                    Member since{" "}
                    {new Date(userData.joinDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 text-sm mt-4">{userData.bio}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FiSettings className="text-indigo-400" /> Quick Actions
              </h3>
            </div>
            <div className="divide-y divide-gray-700">
              <Link
                to="/settings"
                className="block px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3 group"
              >
                <div className="p-2 bg-indigo-900 bg-opacity-30 rounded-lg group-hover:bg-opacity-50 transition">
                  <FiSettings className="text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium">Profile Settings</p>
                  <p className="text-xs text-gray-400">Update your profile</p>
                </div>
              </Link>
              <Link
                to="/my-questions"
                className="block px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3 group"
              >
                <div className="p-2 bg-blue-900 bg-opacity-30 rounded-lg group-hover:bg-opacity-50 transition">
                  <FiHelpCircle className="text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">My Questions</p>
                  <p className="text-xs text-gray-400">View your questions</p>
                </div>
              </Link>
              <Link
                to="/my-answers"
                className="block px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3 group"
              >
                <div className="p-2 bg-green-900 bg-opacity-30 rounded-lg group-hover:bg-opacity-50 transition">
                  <FiMessageSquare className="text-green-400" />
                </div>
                <div>
                  <p className="font-medium">My Answers</p>
                  <p className="text-xs text-gray-400">View your answers</p>
                </div>
              </Link>
              <Link
                to="/bookmarks"
                className="block px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3 group"
              >
                <div className="p-2 bg-purple-900 bg-opacity-30 rounded-lg group-hover:bg-opacity-50 transition">
                  <FiBookmark className="text-purple-400" />
                </div>
                <div>
                  <p className="font-medium">Bookmarks</p>
                  <p className="text-xs text-gray-400">Saved content</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Tabs Navigation */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 font-medium flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "overview"
                    ? "text-indigo-400 border-b-2 border-indigo-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <FiActivity className="inline" /> Overview
              </button>
              <button
                onClick={() => setActiveTab("achievements")}
                className={`px-6 py-4 font-medium flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "achievements"
                    ? "text-indigo-400 border-b-2 border-indigo-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <FiAward className="inline" /> Achievements
              </button>
              {/* <button
                onClick={() => setActiveTab("activity")}
                className={`px-6 py-4 font-medium flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "activity"
                    ? "text-indigo-400 border-b-2 border-indigo-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <FiTrendingUp className="inline" /> Activity
              </button> */}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Section */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FiActivity className="text-indigo-400" /> Your Stats
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Questions Asked",
                      value: stats.questionsAsked,
                      icon: FiHelpCircle,
                      color: "bg-gradient-to-br from-purple-600 to-indigo-600",
                      description: "Total questions posted",
                    },
                    {
                      label: "Answers Given",
                      value: stats.answersGiven,
                      icon: FiMessageSquare,
                      color: "bg-gradient-to-br from-blue-600 to-teal-600",
                      description: "Total answers provided",
                    },
                    {
                      label: "Badges Earned",
                      value: stats.badgesEarned,
                      icon: FiAward,
                      color: "bg-gradient-to-br from-green-600 to-emerald-600",
                      description: "Achievements unlocked",
                    },
                   
                    {
                      label: "Bookmarks",
                      value: stats.bookmarks,
                      icon: FiBookmark,
                      color: "bg-gradient-to-br from-pink-600 to-rose-600",
                      description: "Saved content",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`${stat.color} rounded-xl p-1 shadow-md hover:shadow-lg transition-shadow`}
                    >
                      <div className="bg-gray-800 rounded-lg p-5 h-full">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-xl ${stat.color} bg-opacity-20`}
                          >
                            <stat.icon className="text-xl text-white" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">
                              {stat.label}
                            </p>
                            <p className="text-2xl font-bold mt-1">
                              {stat.value}
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                              {stat.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Web Development News Section - Compact Version */}
              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FiBell className="text-indigo-400" /> Web Development News
                  </h2>
                </div>
                <div className="divide-y divide-gray-700">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-4 hover:bg-gray-750 transition group"
                    >
                      <a
                        href={ann.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium group-hover:text-indigo-400 transition">
                            {ann.title}
                          </h3>
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                            {ann.readingTime} min read
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(ann.date).toLocaleDateString()}
                        </p>
                      </a>
                    </div>
                  ))}
                  {announcements.length === 0 && (
                    <div className="p-6 text-center text-gray-400">
                      No news articles available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FiAward className="text-indigo-400" /> Your Achievements
              </h3>

              {badges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge._id}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl overflow-hidden"
                    >
                      
                      <div className="bg-gray-800 bg-opacity-90 p-5 h-full">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl p-3 rounded-lg bg-opacity-20 bg-white">
                            {badge.icon || "🏆"}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold">{badge.name}</h4>
                            <p className="text-gray-300 mt-1">
                              {badge.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <FiAward className="text-gray-500 text-3xl" />
                  </div>
                  <h3 className="text-xl font-medium">No badges earned yet</h3>
                  <p className="text-gray-400 mt-2 max-w-md mx-auto">
                    Participate in the community to earn badges.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {/* {activeTab === "activity" && (
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FiTrendingUp className="text-indigo-400" /> Recent Activity
              </h3>
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <FiActivity className="text-gray-500 text-3xl" />
                </div>
                <h3 className="text-xl font-medium">No recent activity</h3>
                <p className="text-gray-400 mt-2 max-w-md mx-auto">
                  Your activities will appear here.
                </p>
                <div className="mt-6">
                  <Link
                    to="/ask-question"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                  >
                    Ask Your First Question
                  </Link>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </main>
    </div>
  );
};

export default Profile;
