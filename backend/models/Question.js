import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ Track users who voted
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
