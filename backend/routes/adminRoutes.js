import express from "express";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  // getAllReports,
  // deleteReport,
} from "../controllers/adminController.js";

const router = express.Router();

// Users management
router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);
router.put("/users/:userId", updateUserRole);

// Reports management
// router.get("/reports", getAllReports);
// router.delete("/reports/:reportId", deleteReport);

export default router;
