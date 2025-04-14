import Question from "../models/Question.js";
import User from "../models/User.js"; 
import { updateUserPoints } from "./badgeController.js";

// Get all questions
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("user", "username")
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error });
  }
};



export const createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const userId = req.user._id;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const newQuestion = new Question({
      title,
      description,
      tags,
      user: userId,
    });
    await newQuestion.save();
     await updateUserPoints(userId, 10);

    res
      .status(201)
      .json({ message: "✅ Question posted successfully!", newQuestion });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("user", "username");
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMyQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    if (question.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await question.deleteOne();
    await updateUserPoints(req.user.id, -10);
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Upvote a question
export const upvoteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    // Prevent multiple votes from the same user
    if (question.voters.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "You have already voted on this question." });
    }

    question.upvotes++;
    question.voters.push(req.user.id);
    await question.save();
     await updateUserPoints(question.user, 5); 

    res
      .status(200)
      .json({ message: "Question upvoted successfully", question });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Downvote a question
export const downvoteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    if (question.voters.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "You have already voted on this question." });
    }

    question.downvotes++;
    question.voters.push(req.user.id);
    await question.save();

    res
      .status(200)
      .json({ message: "Question downvoted successfully", question });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get questions with most upvoted answers at the top
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("user", "username email")
      .populate({
        path: "answers",
        populate: { path: "user", select: "username" },
        options: { sort: { upvotes: -1 } }, // ✅ Most upvoted answers at the top
      });

    if (!question)
      return res.status(404).json({ message: "❌ Question not found." });

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};
export const upvoteAnswer = async (req, res) => {
  try {
      const userId = req.user.id;

    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.voters.includes(userId)) {
      return res.status(400).json({ message: "User already voted" });
    }

    answer.upvotes += 1;
    answer.voters.push(userId);
    await answer.save();

    // ✅ Award 5 points to the answer's author
    await updateUserPoints(answer.user, 5);

    res.status(200).json({ message: "Upvoted successfully" });
  } catch (error) {
    console.error("Error upvoting answer:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Accept an answer
export const acceptAnswer = async (req, res) => {
  try {
       const userId = req.user.id;

    const answer = await Answer.findById(req.params.id).populate("question");
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.question.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the question author can accept the answer" });
    }

    if (answer.isAccepted) {
      return res.status(400).json({ message: "Answer already accepted" });
    }

    answer.isAccepted = true;
    await answer.save();

    // ✅ Award 10 points to the answer author
    await updateUserPoints(answer.user, 10);

    res.status(200).json({ message: "Answer accepted successfully" });
  } catch (error) {
    console.error("Error accepting answer:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const questionId = req.params.id;
// console.log(questionId);

    const alreadyBookmarked = user.bookmarks.includes(questionId);

    if (alreadyBookmarked) {
      user.bookmarks.pull(questionId);
    } else {
      user.bookmarks.push(questionId);
    }

    await user.save();
    res.status(200).json({
      message: alreadyBookmarked
        ? "Bookmark removed successfully"
        : "Question bookmarked successfully",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getBookmarkedQuestions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "bookmarks",
      populate: {
        path: "user",
        select: "username", // Include any user fields you want
      },
    });

    res.status(200).json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};