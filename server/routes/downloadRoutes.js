// routes/downloadRoutes.js
import express from "express";
import {
  getAllDownloads,
  getDownloadsByUser,
  createDownloadLog,
  downloadQuestionPaper
} from "../controllers/downloadController.js";

import { protect, protectAdmin } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin Routes
router.get("/", protectAdmin, isAdmin, getAllDownloads);

// User Routes (Students)
router.get("/user/:userId", protect, getDownloadsByUser);
router.post("/", protect, createDownloadLog);

// File Download Route (Students need to be authenticated)
router.get("/questionpaper/:id", protect, downloadQuestionPaper);

export default router;