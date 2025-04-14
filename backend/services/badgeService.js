import Badge from "../models/Badge.js";
import User from "../models/User.js";

// Add points to a user and check for badge eligibility
export const addPoints = async (userId, points) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Add points to the user
    user.points += points;
    await user.save();

    // Check if the user qualifies for new badges
    const badges = await Badge.find({ pointsRequired: { $lte: user.points } });

    // Filter out badges the user already has
   const newBadges = badges.filter(
     (badge) =>
       !user.badges.some((id) => id.toString() === badge._id.toString())
   );
    if (newBadges.length > 0) {
      // Add new badges to the user
      user.badges.push(...newBadges.map((badge) => badge._id));
      await user.save();
    }

    return { user, newBadges };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all badges
export const getAllBadges = async () => {
  try {
    const badges = await Badge.find();
    return badges;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get badges for a specific user
export const getUserBadges = async (userId) => {
  try {
    const user = await User.findById(userId).populate("badges");
    if (!user) throw new Error("User not found");

    return user.badges;
  } catch (error) {
    throw new Error(error.message);
  }
};
