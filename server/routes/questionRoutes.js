import express from "express";
import {
  getAllQuestionPapers,
  getQuestionPaperById,
  createQuestionPaper,
  updateQuestionPaper,
  deleteQuestionPaper,
  getFilteredQuestionPapers,
} from "../controllers/questionController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Public Routes (Students can access)
router.get("/", getAllQuestionPapers);
router.get("/filter", getFilteredQuestionPapers); // For filtering
router.get("/:id", getQuestionPaperById);

// Admin-Only Routes (Protected)
router.post("/add", protect, isAdmin, upload.single('questionPaper'), createQuestionPaper);
router.put("/update/:id", protect, isAdmin, upload.single('questionPaper'), updateQuestionPaper);
router.delete("/delete/:id", protect, isAdmin, deleteQuestionPaper);

export default router;