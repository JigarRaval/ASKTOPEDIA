import User from "../models/User.js";
import Report from "../models/Report.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import Activity from "../models/Activity.js"; // 👈 ADD this line at top

export const warnUserForReport = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { id } = req.params;

    const report = await Report.findById(id).populate("question answer");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    let contentOwnerId = null;

    if (report.question) {
      const question = await Question.findById(report.question._id);
      contentOwnerId = question.user;
    } else if (report.answer) {
      const answer = await Answer.findById(report.answer._id);
      contentOwnerId = answer.user;
    }

    if (!contentOwnerId) {
      return res.status(400).json({ message: "Content owner not found" });
    }

    let relatedContent = "";

    if (report.question) {
      const question = await Question.findById(report.question._id);
      relatedContent = question.title;
    } else if (report.answer) {
      const answer = await Answer.findById(report.answer._id);
      relatedContent = answer.text.substring(0, 100) + "..."; // first 100 chars
    }

    const activity = new Activity({
      user: contentOwnerId,
      type: "warning",
      message: `Your content was reported and a warning issued.`,
      relatedContent,
    });

    await activity.save();

    await Report.findByIdAndDelete(id); // After warning, remove the report

    res.status(200).json({ message: "User warned successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while warning user." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Only allow admins to delete users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { userId } = req.params;

    // Prevent deleting yourself
    if (userId === req.user.id) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }

    await User.findByIdAndDelete(userId);
    await Question.deleteMany({ user: userId });
    await Answer.deleteMany({ user: userId });
    await Report.deleteMany({
      $or: [
        { reporter: userId },
        {
          question: {
            $in: await Question.find({ user: userId }).select("_id"),
          },
        },
      ],
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    // Only allow admins to update roles
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { userId } = req.params;
    const { role } = req.body;

    // Prevent changing your own role
    if (userId === req.user.id) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user role" });
  }
};

export const getAllReports = async (req, res) => {
  try {
    // Only allow admins to view reports
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const reports = await Report.find()
      .populate("reporter", "username email")
      .populate("question", "title")
      .populate("answer", "text");

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

export const resolveReport = async (req, res) => {
  try {
    // Only allow admins to resolve reports
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { reportId } = req.params;
    const { action } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Take action based on report
    if (action === "delete") {
      if (report.question) {
        await Question.findByIdAndDelete(report.question);
      }
      if (report.answer) {
        await Answer.findByIdAndDelete(report.answer);
      }
    }

    await Report.findByIdAndDelete(reportId);
    res.status(200).json({ message: "Report resolved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to resolve report" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // Only allow admins to view stats
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const [userCount, adminCount, reportCount] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "admin" }),
      Report.countDocuments(),
    ]);

    res.status(200).json({ userCount, adminCount, reportCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
