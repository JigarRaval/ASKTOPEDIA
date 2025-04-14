import { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/leaderboard`
        );
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-600">Rank</th>
              <th className="py-2 px-4 border-b border-gray-600">Username</th>
              <th className="py-2 px-4 border-b border-gray-600">Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr
                key={user._id}
                className={`${
                  index === 0
                    ? "bg-yellow-500"
                    : index === 1
                    ? "bg-gray-500"
                    : index === 2
                    ? "bg-orange-400"
                    : "bg-gray-700"
                }`}
              >
                <td className="py-2 px-4 border-b border-gray-600">
                  {index + 1}
                </td>
                <td className="py-2 px-4 border-b border-gray-600">
                  {user.username}
                </td>
                <td className="py-2 px-4 border-b border-gray-600">
                  {user.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
