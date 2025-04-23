import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // For local testing only, remove in production
  },
});

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.error("Error with mail config:", error);
  } else {
    console.log("Mail server is ready to send messages");
  }
});

export default transporter;
