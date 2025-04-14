import { useEffect, useState, useContext } from "react";
import { getUserBadges, getAllBadges } from "../services/badgeService";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  FaTrophy,
  FaMedal,
  FaSearch,
  FaTimes,
  FaAward,
  FaChartLine,
  FaCrown,
} from "react-icons/fa";
import { GiLaurelsTrophy } from "react-icons/gi";

const Badges = () => {
  const { user, setUser } = useContext(AuthContext);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const [view, setView] = useState("badges");
  const [leaderboard, setLeaderboard] = useState([]);
  const [search, setSearch] = useState("");
  const [badgesLoaded, setBadgesLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(user);
        
        if (user) {
          const [badgesData, pointsData] = await Promise.all([
            getUserBadges(user._id),
            axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/api/users/profile`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            ),
          ]);
          setEarnedBadges(badgesData);
          setUser(pointsData.data);
        }

        const leaderboardData = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/leaderboard`
        );
        setLeaderboard(leaderboardData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user, setUser]);

  const fetchAllBadges = async () => {
    try {
      const data = await getAllBadges();
      setAllBadges(data);
      setBadgesLoaded(true);
    } catch (error) {
      console.error("Failed to load all badges:", error);
    }
  };

  const handleShowAllBadges = async () => {
    if (!showAll && !badgesLoaded) {
      await fetchAllBadges();
    }
    setShowAll(!showAll);
  };

  const filteredLeaderboard = leaderboard.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const getRankColor = (rank) => {
    switch (rank) {
      case 0:
        return "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 shadow-gold";
      case 1:
        return "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 shadow-silver";
      case 2:
        return "bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 shadow-bronze";
      default:
        return "bg-gray-800/70 hover:bg-gray-700/80 transition-colors";
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 0:
        return (
          <GiLaurelsTrophy className="text-yellow-300 text-lg md:text-xl" />
        );
      case 1:
        return <FaTrophy className="text-gray-200 text-base md:text-lg" />;
      case 2:
        return <FaMedal className="text-amber-300 text-base md:text-lg" />;
      default:
        return <span className="text-gray-400">{rank + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-4 px-3 sm:py-8 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-6 sm:mb-12">
          <motion.div
            className="text-center mb-4 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Achievement Hall
            </h1>
            <p className="text-gray-400 max-w-md text-xs xs:text-sm sm:text-base">
              Celebrate your accomplishments and track your progress
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-8">
            <motion.button
              onClick={() => setView("badges")}
              className={`px-3 xs:px-4 sm:px-6 py-1 xs:py-2 sm:py-3 rounded-full font-medium flex items-center gap-1 xs:gap-2 transition-all text-xs xs:text-sm sm:text-base ${
                view === "badges"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaAward className="text-yellow-300 text-xs xs:text-sm sm:text-base" />
              <span className="hidden xs:inline">My Badges</span>
              <span className="xs:hidden">Badges</span>
            </motion.button>
            <motion.button
              onClick={() => setView("leaderboard")}
              className={`px-3 xs:px-4 sm:px-6 py-1 xs:py-2 sm:py-3 rounded-full font-medium flex items-center gap-1 xs:gap-2 transition-all text-xs xs:text-sm sm:text-base ${
                view === "leaderboard"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaChartLine className="text-green-300 text-xs xs:text-sm sm:text-base" />
              <span className="hidden xs:inline">Leaderboard</span>
              <span className="xs:hidden">Top</span>
            </motion.button>
          </div>

          {view === "badges" && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 mb-4 sm:mb-8 border border-gray-700/50 shadow-lg">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold mb-2 xs:mb-3 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Your Progress
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-3 sm:gap-4">
                  <div className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 p-2 xs:p-3 sm:p-5 rounded-lg xs:rounded-xl border border-blue-500/20">
                    <p className="text-xs text-blue-300 mb-1">Total Points</p>
                    <p className="text-xl xs:text-2xl sm:text-3xl font-bold flex items-center gap-1 xs:gap-2">
                      {user?.points || 0}
                      <span className="text-xs text-blue-200 font-normal">
                        pts
                      </span>
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-600/30 to-green-800/30 p-2 xs:p-3 sm:p-5 rounded-lg xs:rounded-xl border border-green-500/20">
                    <p className="text-xs text-green-300 mb-1">Badges Earned</p>
                    <p className="text-xl xs:text-2xl sm:text-3xl font-bold flex items-center gap-1 xs:gap-2">
                      {earnedBadges.length}
                      {badgesLoaded && (
                        <span className="text-xs text-green-200 font-normal">
                          / {allBadges.length}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 p-2 xs:p-3 sm:p-5 rounded-lg xs:rounded-xl border border-purple-500/20">
                    <p className="text-xs text-purple-300 mb-1">Completion</p>
                    <p className="text-xl xs:text-2xl sm:text-3xl font-bold">
                      {badgesLoaded && allBadges.length > 0
                        ? `${Math.round(
                            (earnedBadges.length / allBadges.length) * 100
                          )}%`
                        : "0%"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4 sm:mb-8 text-center">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold mb-1 xs:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
                  Your Badge Collection
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-xs xs:text-sm sm:text-base">
                  {earnedBadges.length > 0
                    ? "These are the badges you've earned through your contributions"
                    : "Complete challenges and contribute to earn your first badge!"}
                </p>
              </div>
              {earnedBadges.length > 0 ? (
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 xs:gap-4 sm:gap-6">
                  {earnedBadges.map((badge) => (
                    <motion.div
                      key={badge._id}
                      className="relative bg-gradient-to-br from-green-500/90 to-green-600 p-2 xs:p-3 sm:p-5 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg flex flex-col items-center cursor-pointer group border-2 border-green-400/30 hover:border-green-300/50 transition-all"
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      onMouseEnter={() => setHoveredBadge(badge)}
                      onMouseLeave={() => setHoveredBadge(null)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute -top-1.5 -right-1.5 xs:-top-2 xs:-right-2 sm:-top-3 sm:-right-3 bg-yellow-500 text-[10px] xs:text-xs font-bold px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full shadow-md">
                        ★
                      </div>
                      <img
                        src={badge.image}
                        alt={badge.name}
                        className="w-12 h-12 xs:w-14 xs:h-14 sm:w-20 sm:h-20 mb-1 xs:mb-2 sm:mb-3 object-contain drop-shadow-lg"
                      />
                      <h3 className="text-xs xs:text-sm sm:text-lg font-semibold text-center text-white line-clamp-1">
                        {badge.name}
                      </h3>
                      <p className="text-[10px] xs:text-xs text-gray-200 bg-gray-900/50 px-1.5 xs:px-2 py-0.5 rounded-full">
                        {badge.pointsRequired} pts
                      </p>

                      <AnimatePresence>
                        {hoveredBadge?._id === badge._id && (
                          <motion.div
                            className="absolute inset-0 bg-black/90 rounded-lg xs:rounded-xl sm:rounded-2xl flex flex-col justify-center items-center p-2 xs:p-3 sm:p-4 z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <h3 className="text-sm xs:text-base sm:text-xl font-bold text-center">
                              {badge.name}
                            </h3>
                            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-300 text-center mt-1 xs:mt-2">
                              {badge.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="text-center py-6 xs:py-8 sm:py-12 bg-gray-800/50 rounded-lg xs:rounded-xl sm:rounded-2xl border border-dashed border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <FaMedal className="mx-auto text-3xl xs:text-4xl sm:text-5xl text-gray-600 mb-2 xs:mb-3 sm:mb-4" />
                  <p className="text-gray-400 text-sm xs:text-base sm:text-lg font-medium">
                    Your badge collection is empty
                  </p>
                  <p className="text-gray-500 mt-1 xs:mt-2 text-xs xs:text-sm sm:text-base">
                    Start contributing to unlock your first achievement!
                  </p>
                  <motion.button
                    className="mt-3 xs:mt-4 sm:mt-6 px-3 xs:px-4 sm:px-6 py-1 xs:py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-xs xs:text-sm font-medium shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    How to earn badges
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {view === "leaderboard" && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 sm:mb-8 text-center">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold mb-1 xs:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Community Leaderboard
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-xs xs:text-sm sm:text-base">
                  See how you stack up against other contributors
                </p>
              </div>

              <div className="relative mb-4 sm:mb-6 md:mb-8 max-w-md mx-auto">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 xs:py-2.5 sm:py-3 bg-gray-800/70 text-white border border-gray-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none shadow-md transition-all text-xs xs:text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-700/50">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px] xs:min-w-[600px]">
                    <thead className="bg-gradient-to-r from-purple-900/50 to-pink-900/50">
                      <tr>
                        <th className="py-2 xs:py-3 sm:py-4 px-3 xs:px-4 sm:px-6 text-left font-medium text-gray-300 text-xs xs:text-sm">
                          Rank
                        </th>
                        <th className="py-2 xs:py-3 sm:py-4 px-3 xs:px-4 sm:px-6 text-left font-medium text-gray-300 text-xs xs:text-sm">
                          User
                        </th>
                        <th className="py-2 xs:py-3 sm:py-4 px-3 xs:px-4 sm:px-6 text-right font-medium text-gray-300 text-xs xs:text-sm">
                          Points
                        </th>
                        <th className="py-2 xs:py-3 sm:py-4 px-3 xs:px-4 sm:px-6 text-right font-medium text-gray-300 text-xs xs:text-sm">
                          Badges
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {filteredLeaderboard.map((u, index) => (
                        <motion.tr
                          key={u._id}
                          className={`${getRankColor(index)} ${
                            index < 3 ? "text-white" : "text-gray-300"
                          } hover:scale-[1.005] transition-transform`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className="py-2 xs:py-3 sm:py-4 px-3 xs:px-4 sm:px-6 font-medium">
                            <div className="flex items-center gap-2 xs:gap-3">
                              {getRankIcon(index)}
                              <span className={index < 3 ? "font-bold" : ""}>
                                {index + 1}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 xs:py-3 sm:py-4 px-3 xs:px-4 sm:px-6">
                            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
                              <div className="relative">
                                <img
                                  src={
                                    u.profileImage ||
                                    `https://i.pravatar.cc/150?img=${index}`
                                  }
                                  alt={u.username}
                                  className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-600/50"
                                />
                                {index < 3 && (
                                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 xs:p-1">
                                    {index === 0 && (
                                      <GiLaurelsTrophy className="text-yellow-500 text-[10px] xs:text-xs" />
                                    )}
                                    {index === 1 && (
                                      <FaTrophy className="text-gray-400 text-[10px] xs:text-xs" />
                                    )}
                                    {index === 2 && (
                                      <FaMedal className="text-amber-600 text-[10px] xs:text-xs" />
                                    )}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-xs xs:text-sm sm:text-base line-clamp-1">
                                  {u.username}
                                </div>
                                {u._id === user?._id && (
                                  <span className="text-[10px] xs:text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-2 xs:py-3 sm:py-4 px-3 xs:px-4 sm:px-6 text-right font-bold">
                            <div className="flex justify-end items-center gap-1">
                              {u.points}
                              <span className="text-[10px] xs:text-xs text-gray-400 font-normal">
                                pts
                              </span>
                            </div>
                          </td>
                          <td className="py-2 xs:py-3 sm:py-4 px-3 xs:px-4 sm:px-6 text-right">
                            <div className="flex justify-end items-center gap-1">
                              {u.badges?.length || 0}
                              <FaAward className="text-yellow-400/80 text-xs" />
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {filteredLeaderboard.length === 0 && (
                <div className="text-center py-6 xs:py-8 sm:py-12 bg-gray-800/50 rounded-lg xs:rounded-xl sm:rounded-2xl mt-3 sm:mt-4">
                  <p className="text-gray-400 text-sm">
                    No users found matching your search
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <motion.button
        className="fixed bottom-4 right-4 xs:bottom-6 xs:right-6 sm:bottom-8 sm:right-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 xs:p-3 sm:p-4 rounded-full shadow-xl hover:shadow-2xl z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleShowAllBadges}
        aria-label={showAll ? "Close all badges" : "View all badges"}
      >
        {showAll ? (
          <FaTimes size={16} xs:size={18} sm:size={20} className="text-white" />
        ) : (
          <div className="relative">
            <FaMedal
              size={16}
              xs:size={18}
              sm:size={20}
              className="text-yellow-300"
            />
            {badgesLoaded && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-[8px] xs:text-[10px] font-bold rounded-full w-3 h-3 xs:w-4 xs:h-4 flex items-center justify-center">
                {allBadges.length}
              </span>
            )}
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {showAll && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex justify-center items-start pt-12 sm:pt-16 px-2 xs:px-3 sm:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-gray-800 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl max-h-[75vh] sm:max-h-[80vh] overflow-y-auto border border-gray-700/50 mx-2"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 p-3 xs:p-4 sm:p-5 flex justify-between items-center border-b border-gray-700/50 backdrop-blur-sm z-10">
                <h3 className="text-lg xs:text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-300">
                  All Available Badges
                </h3>
                <button
                  onClick={() => setShowAll(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes size={16} xs:size={18} />
                </button>
              </div>

              <div className="p-3 xs:p-4 sm:p-6">
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
                  {allBadges.map((badge) => {
                    const isEarned = earnedBadges.some(
                      (b) => b._id === badge._id
                    );
                    return (
                      <motion.div
                        key={badge._id}
                        className={`relative p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl flex flex-col items-center transition-all border-2 ${
                          isEarned
                            ? "bg-gradient-to-br from-green-500/90 to-green-600 border-green-400/30"
                            : "bg-gray-700/80 border-gray-600/30"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        onMouseEnter={() => setHoveredBadge(badge)}
                        onMouseLeave={() => setHoveredBadge(null)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {!isEarned && (
                          <div className="absolute inset-0 bg-black/30 rounded-lg xs:rounded-xl z-0" />
                        )}
                        <img
                          src={badge.image}
                          alt={badge.name}
                          className={`w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 mb-1 xs:mb-2 sm:mb-3 object-contain ${
                            !isEarned ? "opacity-70 grayscale" : ""
                          }`}
                        />
                        <h3
                          className={`text-xs xs:text-sm sm:text-lg font-semibold text-center ${
                            !isEarned ? "text-gray-400" : "text-white"
                          } line-clamp-1`}
                        >
                          {badge.name}
                        </h3>
                        <p
                          className={`text-[10px] xs:text-xs px-1.5 xs:px-2 py-0.5 rounded-full ${
                            isEarned
                              ? "text-gray-200 bg-gray-900/50"
                              : "text-gray-500 bg-gray-800"
                          }`}
                        >
                          {badge.pointsRequired} pts
                        </p>

                        <AnimatePresence>
                          {hoveredBadge?._id === badge._id && (
                            <motion.div
                              className="absolute inset-0 bg-black/90 rounded-lg xs:rounded-xl flex flex-col justify-center items-center p-2 xs:p-3 sm:p-4 z-10"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <h3 className="text-sm xs:text-base sm:text-lg font-bold text-center">
                                {badge.name}
                              </h3>
                              <p className="text-[10px] xs:text-xs sm:text-sm text-gray-300 text-center mt-1 xs:mt-2">
                                {badge.description}
                              </p>
                              <div
                                className={`mt-1 xs:mt-2 text-[10px] xs:text-xs px-2 xs:px-3 py-0.5 rounded-full ${
                                  isEarned
                                    ? "text-green-400 bg-green-900/30"
                                    : "text-yellow-400 bg-yellow-900/30"
                                }`}
                              >
                                {isEarned ? "✅ Earned" : "🔒 Not earned yet"}
                              </div>
                              {!isEarned && (
                                <p className="text-[10px] xs:text-xs text-blue-300 mt-1">
                                  {badge.pointsRequired - (user?.points || 0)}{" "}
                                  more points needed
                                </p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Badges;
