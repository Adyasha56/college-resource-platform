import express from "express";
import {
  getAllQuestionPapers,
  getQuestionPaperById,
  createQuestionPaper,
  updateQuestionPaper,
  deleteQuestionPaper,
} from "../controllers/questionController.js";

import { protect } from "../middleware/authMiddleware.js";    // User Authentication
import { isAdmin } from "../middleware/adminMiddleware.js";  // Admin Authorization

const router = express.Router();

// Public -  (Anyone can view questions)
router.get("/", getAllQuestionPapers);
router.get("/:id", getQuestionPaperById);

// Admin-Only Routes
router.post("/add", protect, isAdmin, createQuestionPaper);
router.put("/update/:id", protect, isAdmin, updateQuestionPaper);
router.delete("/delete/:id", protect, isAdmin, deleteQuestionPaper);

export default router;
