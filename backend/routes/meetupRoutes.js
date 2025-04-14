import express from "express";
import {
  createMeetup,
  updateMeetupStatus,
  getMeetupHistory,
} from "../controllers/meetupController.js";
import { getAllUsers } from "../controllers/userController.js";
const router = express.Router();

// ✅ Create meetup request
router.post("/request", createMeetup);

// ✅ Update meetup status (Accept/Reject)
router.put("/status/:id", updateMeetupStatus);

// ✅ Get meetup history for a user
router.get("/history/:userId", getMeetupHistory);
router.get("/all", getAllUsers);
export default router;
