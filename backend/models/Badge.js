import mongoose from "mongoose";

const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  pointsRequired: { type: Number, required: true },
  image: { type: String, required: true },
});

const Badge = mongoose.model("Badge", BadgeSchema);
export default Badge;
