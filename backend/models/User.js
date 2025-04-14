import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  location: { type: String },
  bio: { type: String },
  profileImage: { type: String },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
  questionsAsked: { type: Number, default: 0 },
  answersAccepted: { type: Number, default: 0 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
});

const User = mongoose.model("User", userSchema);
export default User;
