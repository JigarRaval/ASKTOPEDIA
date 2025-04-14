import express from "express";
import {
  postAnswer,
  getMyAnswers,
  deleteMyAnswer,
  upvoteAnswer,
  downvoteAnswer,
  acceptAnswer,
  getAnswerById,
} from "../controllers/answerController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-answers", protect, getMyAnswers);
router.delete("/my-answers/:id", protect, deleteMyAnswer);
router.post("/", protect, postAnswer);

// ✅ Upvote and Downvote routes
router.put("/:id/upvote", protect, upvoteAnswer);
router.put("/:id/downvote", protect, downvoteAnswer);

// ✅ Accept Answer route
router.put("/:id/accept", protect, acceptAnswer);
router.get("/:id", protect, getAnswerById);

export default router;
