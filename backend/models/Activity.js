import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["warning", "info", "ban"], required: true },
    message: { type: String, required: true },
    relatedContent: { type: String }, 
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
