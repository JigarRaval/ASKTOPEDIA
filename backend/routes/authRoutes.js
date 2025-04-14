import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import protect  from "../middleware/authMiddleware.js"; // Ensure user is logged in



const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
