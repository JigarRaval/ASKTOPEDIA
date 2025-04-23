import express from "express";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
  deleteAccount,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js"; // Ensure user is logged in

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/change-password", protect, changePassword);
router.post("/delete-account", protect, deleteAccount);
export default router;
