import express from "express";
import {
  getAllDownloads,
  getDownloadsByUser,
  createDownloadLog,
} from "../controllers/downloadController.js";

import {protect} from "../middleware/authMiddleware.js";
import {isAdmin} from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin Route
router.get("/", protect, isAdmin, getAllDownloads);

// User Route
router.get("/user/:userId", protect, getDownloadsByUser);

// Create Log Route (User or Admin can create)
router.post("/", protect, createDownloadLog);

export default router;
