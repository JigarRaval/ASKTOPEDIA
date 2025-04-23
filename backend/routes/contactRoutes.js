import { Router } from "express";
import { sendContactEmail } from "../controllers/contactController.js";
import validateContact from "../middleware/validateContact.js";

const router = Router();

router.post("/contact", validateContact, sendContactEmail);

export default router;
