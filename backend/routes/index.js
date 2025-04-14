import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import questionRoutes from "./questionRoutes.js";
import answerRoutes from "./answerRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import badgeRoutes from "./badgeRoutes.js";
import reportRoutes from "./reportRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/questions", questionRoutes);
router.use("/answers", answerRoutes);
router.use("/upload", uploadRoutes);
router.use("/badges", badgeRoutes);
router.use("/reports", reportRoutes);
router.use("/admin", adminRoutes);

export default router;
