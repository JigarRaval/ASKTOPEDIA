import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import User from "../models/User.js"; 
import { updateUserPoints} from "./badgeController.js"

export const postAnswer = async (req, res) => {
  try {
    const { questionId, text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Answer text is required" }); // ✅ Return after sending response
    }

    const answer = new Answer({
      text,
      user: req.user.id,
      question: questionId,
    });

    await answer.save();

    // ✅ Update the question with the new answer
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" }); // ✅ Return after sending response
    }

    question.answers.push(answer._id);
    await question.save();
    await updateUserPoints(req.user.id, 5);
    
    return res
      .status(201)
      .json({ message: "Answer posted successfully", answer }); // ✅ Single response
  } catch (error) {
    console.error("Error posting answer:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message }); // ✅ Return after error
  }
};

export const getMyAnswers = async (req, res) => {
  try {
    const answers = await Answer.find({ user: req.user.id })
      .populate("question", "title") // Populate question title
      .sort({ createdAt: -1 });

    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an answer
export const deleteMyAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this answer" });
    }

    // ✅ Deduct points for deleting an answer
    await updateUserPoints(userId, -5);

    await answer.deleteOne();

    res.status(200).json({ message: "Answer deleted and points deducted" });
  } catch (error) {
    console.error("Error deleting answer:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Upvote an answer
export const upvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    // Prevent multiple upvotes from the same user
    if (answer.voters.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "You have already voted on this answer." });
    }

    answer.upvotes++;
    answer.voters.push(req.user.id);
    await answer.save();
await updateUserPoints(answer.user, 5);
    res.status(200).json({ message: "Answer upvoted successfully", answer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Downvote an answer
export const downvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.voters.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "You have already voted on this answer." });
    }

    answer.downvotes++;
    answer.voters.push(req.user.id);
    await answer.save();

    res.status(200).json({ message: "Answer downvoted successfully", answer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Accept an answer (Only by the question's author)
export const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const question = await Question.findById(answer.question);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // ✅ Only the question's author can accept an answer
    if (question.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not the author of this question" });
    }

    // ✅ Unaccept any other accepted answers
    await Answer.updateMany({ question: question._id }, { isAccepted: false });

    // ✅ Mark selected answer as accepted
    answer.isAccepted = true;
    await answer.save();
await updateUserPoints(answer.user, 10);
    return res
      .status(200)
      .json({ message: "Answer accepted successfully", answer }); // ✅ Single response
  } catch (error) {
    console.error("Error accepting answer:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message }); // ✅ Single error response
  }
};

export const getAnswerById = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id)
      .populate("user", "username")
      .populate("question", "title description");

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    res.status(200).json(answer);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch answer details" });
  }
};
