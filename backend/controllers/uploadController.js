import fs from "fs"; // ✅ Required to remove file after upload
import cloudinary from "../config/cloudnary.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

export const uploadFile = async (req, res) => {
  try {
    const file = req.files.file;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "asktopedia_uploads",
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "asktopedia",
      use_filename: true,
      unique_filename: false,
    });

    // ✅ Remove the file from local storage after upload
    fs.unlinkSync(req.file.path);

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
};
