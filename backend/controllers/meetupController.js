import Meetup from "../models/Meetup.js";
import mongoose from "mongoose";

// ✅ Create Meetup Request
export const createMeetup = async (req, res) => {
  try {
    const { title, time, details, requester, receiver } = req.body;

    if (!title || !time || !requester || !receiver) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (
      !mongoose.Types.ObjectId.isValid(requester) ||
      !mongoose.Types.ObjectId.isValid(receiver)
    ) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const newMeetup = new Meetup({
      title,
      time,
      details,
      requester,
      receiver,
      status: "pending",
    });

    await newMeetup.save();

    res.status(201).json(newMeetup);
  } catch (error) {
    console.error("Error creating meetup:", error);
    res.status(500).json({ message: "Error creating meetup", error });
  }
};

// ✅ Update Status (Accept/Reject)
export const updateMeetupStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const meetup = await Meetup.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("requester receiver", "name email");

    if (!meetup) {
      return res.status(404).json({ message: "Meetup not found." });
    }

    // If rejected, delete the meetup
    if (status === "rejected") {
      await Meetup.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Meetup rejected and removed." });
    }

    res.status(200).json(meetup);
  } catch (error) {
    console.error("Error updating meetup status:", error);
    res.status(500).json({ message: "Error updating meetup status", error });
  }
};

// ✅ Fetch Meetup History (Accepted/Rejected)
export const getMeetupHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

const meetups = await Meetup.find({
  $or: [{ requester: userId }, { receiver: userId }],
})
  .populate("requester", "name email")
  .populate("receiver", "name email") // ✅ Ensure receiver is populated
  .sort({ createdAt: -1 });


    res.status(200).json(meetups);
  } catch (error) {
    console.error("Error fetching meetup history:", error);
    res.status(500).json({ message: "Error fetching meetup history", error });
  }
};
