// routes/reportRoutes.js
import express from "express";
import Report from "../models/Report.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { question, answer, reason, description } = req.body;

    if (!question && !answer) {
      return res
        .status(400)
        .json({ message: "Either question or answer must be provided" });
    }

    const report = new Report({
      reporter: req.user._id,
      question,
      answer,
      reason,
      description,
    });

    await report.save();

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all reports (for admin)
// @route   GET /api/reports
// @access  Private/Admin
router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const reports = await Report.find()
      .populate("reporter", "username")
      .populate("question", "title")
      .populate("answer", "text");

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update report status
// @route   PUT /api/reports/:id
// @access  Private/Admin
router.put("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { status } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    await report.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Add to reportRoutes.js
// @desc    Check if user has reported specific content
// @route   GET /api/reports/check
// @access  Private
router.get("/check", protect, async (req, res) => {
  try {
    const { question, answer } = req.query;

    if (!question && !answer) {
      return res
        .status(400)
        .json({ message: "Either question or answer must be provided" });
    }

    const query = {
      reporter: req.user._id,
      $or: [{ question }, { answer }],
    };

    const report = await Report.findOne(query);
    res.json({ reported: !!report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
