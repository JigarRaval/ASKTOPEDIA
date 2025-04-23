import express from "express";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllReports,
  resolveReport,
  getDashboardStats,
  warnUserForReport,
} from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// Users management
router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);
router.put("/users/:userId", updateUserRole);

// Reports management
router.get("/reports", getAllReports);
router.delete("/reports/:reportId", resolveReport);
// routes/adminRoutes.js

router.post("/reports/:id/warn", warnUserForReport);

// Dashboard stats
router.get("/stats", getDashboardStats);

export default router;
