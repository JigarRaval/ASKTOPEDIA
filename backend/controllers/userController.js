import User from "../models/User.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import Activity from "../models/Activity.js";

import {
  checkAndAssignBadges,
  checkMilestoneBadges,
} from "./badgeController.js";

// ✅ Get All Users (for Dropdown)
export const getMyActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); // latest first
    res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch activities." });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username email");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const questionsAsked = await Question.countDocuments({ user: userId });
    const answersGiven = await Answer.countDocuments({ user: userId });
    const user = await User.findById(userId);

    res.json({
      questionsAsked,
      answersGiven,
      badgesEarned: user.badges?.length || 0,
      bookmarks: user.bookmarks?.length || 0, // Assume user has a 'badges' field
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, location, bio, profileImage } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, location, bio, profileImage },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};
// ✅ Update user points and assign badges
export const updateUserPoints = async (userId, points) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // ✅ Update user points
    user.points += points;

    // ✅ Ensure points don't go below zero
    if (user.points < 0) user.points = 0;

    // ✅ Save user after points update
    await user.save();

    // ✅ Trigger automatic badge assignment
    await checkAndAssignBadges(userId);
    await checkMilestoneBadges(userId);

    console.log(`✅ Points updated for user ${userId}: ${user.points}`);
  } catch (error) {
    console.error("❌ Error updating user points:", error);
    throw error;
  }
};

// ✅ Example of updating points after an activity
export const addQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const points = 10; // ✅ 10 points for asking a question

    const user = await User.findById(userId);
    user.questionsAsked += 1; // ✅ Increment questionsAsked
    await user.save();

    await updateUserPoints(userId, points);

    res.status(200).json({ message: "Question added and points updated" });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Add answer and update points
export const addAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const points = 5; // ✅ 5 points for giving an answer

    await updateUserPoints(userId, points);

    res.status(200).json({ message: "Answer added and points updated" });
  } catch (error) {
    console.error("Error adding answer:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const acceptAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const points = 10; // ✅ 10 points for getting an accepted answer

    const user = await User.findById(userId);
    user.answersAccepted += 1; // ✅ Increment accepted answers
    await user.save();

    await updateUserPoints(userId, points);

    res.status(200).json({ message: "Answer accepted and points updated" });
  } catch (error) {
    console.error("Error accepting answer:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ points: -1 })
      .limit(10)
      .select("username points profileImage");

    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: "Failed to load leaderboard", error });
  }
};
