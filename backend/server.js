import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import meetupRoutes from "./routes/meetupRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import answerRoutes from "./routes/answerRoutes.js"; // ✅ Import the new route
import userRoutes from "./routes/userRoutes.js";  
import uploadRoutes from "./routes/uploadRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
// import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow frontend URL
    credentials: true, // Allow cookies & auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
app.options("*", cors());
app.use("/api/auth", authRoutes);
app.use("/api", contactRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes); // ✅ Now requests to /api/answers will work
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/meetups", meetupRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
// app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
