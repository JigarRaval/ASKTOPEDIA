import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import upload from "../middleware/upload.js"; // Multer setup
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadImage); // Upload image to Cloudinary

export default router;
