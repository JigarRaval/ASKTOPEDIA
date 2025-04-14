import express from "express";
import {
  getAllBadges,
  addBadge,
  getUserBadges,
} from "../controllers/badgeController.js";
import protect from "../middleware/authMiddleware.js"
const router = express.Router();

router.get("/", getAllBadges);
router.post("/add", addBadge);
router.get("/user/:userId", getUserBadges);
export default router;
