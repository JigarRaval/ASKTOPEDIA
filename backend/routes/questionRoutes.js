import express from "express";
import {
  getQuestions,
  createQuestion,
  getQuestionById,
  getMyQuestions,
  deleteMyQuestion,
  upvoteQuestion, // ✅ New
  downvoteQuestion,
  toggleBookmark,
  getBookmarkedQuestions,
} from "../controllers/questionController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-questions", protect, getMyQuestions);
router.get("/", getQuestions);
router.get("/:id", getQuestionById);
router.post("/", protect, createQuestion);
router.delete("/my-questions/:id", protect, deleteMyQuestion);

// ✅ Upvote and Downvote routes
router.put("/:id/upvote", protect, upvoteQuestion);
router.put("/:id/downvote", protect, downvoteQuestion);
router.put("/:id/bookmark", protect, toggleBookmark);
router.get("/bookmarks/all", protect, getBookmarkedQuestions);
export default router;
