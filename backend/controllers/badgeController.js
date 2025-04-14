import Badge from "../models/Badge.js";
import User from "../models/User.js";

// Get badges assigned to a user
export const getUserBadges = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("badges");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.badges);
  } catch (error) {
    console.error("Error fetching user badges:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Assign badge to user
export const addBadgeToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { badgeId } = req.body;
    console.log(req.body);

    const user = await User.findById(userId).populate("badges");
    const badge = await Badge.findById(badgeId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!badge) return res.status(404).json({ message: "Badge not found" });

    if (user.badges.some((b) => b._id.toString() === badgeId)) {
      return res.status(400).json({ message: "Badge already assigned" });
    }

    user.badges.push(badgeId);
    await user.save();

    res.status(200).json({
      message: "Badge added successfully",
      badges: user.badges,
    });
  } catch (error) {
    console.error("Error adding badge:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all available badges
export const getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    res.status(200).json(badges);
  } catch (error) {
    console.error("Error fetching all badges:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Create a new badge
export const addBadge = async (req, res) => {
  try {
    const { name, description, pointsRequired, image } = req.body;
    const newBadge = new Badge({
      name,
      description,
      pointsRequired,
      image,
    });
    await newBadge.save();
    res.status(201).json(newBadge);
  } catch (error) {
    console.error("Error adding badge:", error.message);
    res
      .status(400)
      .json({ message: "Failed to create badge", error: error.message });
  }
};

// ✅ Automatically assign badges based on points
export const checkAndAssignBadges = async (userId) => {
  try {
    const user = await User.findById(userId).populate("badges");
    if (!user) return;

    const allBadges = await Badge.find();
    
    const badgesToAssign = [];

    // Check which badges should be assigned
    for (const badge of allBadges) {
      const alreadyHasBadge = user.badges.some(
        (b) => b.toString() === badge._id.toString()
      );

      if (user.points >= badge.pointsRequired && !alreadyHasBadge) {
        badgesToAssign.push(badge._id);
      }
    }

    // If there are badges to assign, update the user
    if (badgesToAssign.length > 0) {
      user.badges.push(...badgesToAssign);
      await user.save();
    }
  } catch (error) {
    console.error("Error assigning badges:", error.message);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// ✅ Assign milestone badges
export const checkMilestoneBadges = async (userId) => {
  try {
    const user = await User.findById(userId).populate("badges");
    console.log(user)
    if (!user) return;

    const [curiousBadge, trustedHelperBadge] = await Promise.all([
      Badge.findOne({ name: "Curious Badge" }),
      Badge.findOne({ name: "Trusted Helper Badge" }),
    ]);

    const badgesToAssign = [];

    // Award Curious Badge (50 questions asked)
    if (
      curiousBadge &&
      user.questionsAsked >= 50 &&
      !user.badges.some((b) => b.toString() === curiousBadge._id.toString())
    ) {
      badgesToAssign.push(curiousBadge._id);
    }

    // Award Trusted Helper Badge (50 accepted answers)
    if (
      trustedHelperBadge &&
      user.answersAccepted >= 50 &&
      !user.badges.some(
        (b) => b.toString() === trustedHelperBadge._id.toString()
      )
    ) {
      badgesToAssign.push(trustedHelperBadge._id);
    }

    // If there are badges to assign, update the user
    if (badgesToAssign.length > 0) {
      user.badges.push(...badgesToAssign);
      await user.save();
    }
  } catch (error) {
    console.error("Error assigning milestone badges:", error.message);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// ✅ Trigger badge assignment when points are updated
export const updateUserPoints = async (userId, points) => {
  try {
    const user = await User.findById(userId);
    
    
    if (!user) return;

    user.points += points;
    await user.save();

    // Trigger automatic badge assignment
    await Promise.all([
      checkMilestoneBadges(userId),
      checkAndAssignBadges(userId),
    ]);
  } catch (error) {
    console.error("Error updating user points:", error.message);
    throw error;
  }
};
