import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const users = [
  {
    username: "admin1",
    email: "admin1@example.com",
    password: "admin123",
    role: "admin",
    points: 100,
    location: "New York",
    bio: "I am the admin of this platform.",
    profileImage: "https://via.placeholder.com/150",
    questionsAsked: 10,
    answersAccepted: 5,
  },
  {
    username: "user1",
    email: "user1@example.com",
    password: "user123",
    role: "user",
    points: 50,
    location: "Los Angeles",
    bio: "I love asking questions!",
    profileImage: "https://via.placeholder.com/150",
    questionsAsked: 5,
    answersAccepted: 2,
  },
  {
    username: "user2",
    email: "user2@example.com",
    password: "user123",
    role: "user",
    points: 30,
    location: "Chicago",
    bio: "I am here to learn.",
    profileImage: "https://via.placeholder.com/150",
    questionsAsked: 3,
    answersAccepted: 1,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    console.log("✅ Existing users deleted");

    // Insert seed data
    await User.insertMany(users);
    console.log("✅ Seed data inserted");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
