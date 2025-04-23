import express from "express";
import {
  getUserProfile,
  getUserStats,
  updateUser,
  getLeaderboard,
  getMyActivities,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import { addBadgeToUser } from "../controllers/badgeController.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.get("/stats", protect, getUserStats);
router.get("/leaderboard", getLeaderboard);
router.put("/:id", protect, updateUser);
router.post("/:userId/badges", addBadgeToUser);
router.get("/activity", protect, getMyActivities);
export default router;
