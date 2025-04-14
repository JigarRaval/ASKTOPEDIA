import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// ✅ Multer storage configuration (Store file in temp directory)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store file temporarily before Cloudinary upload
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

// ✅ File filter
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) return cb(null, true);
  cb(new Error("Invalid file type"));
};

const upload = multer({ storage, fileFilter });

export default upload;
