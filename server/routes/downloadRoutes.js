import express from "express";
import {
  getAllDownloads,
  getDownloadsByUser,
  createDownloadLog,
} from "../controllers/downloadController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin Route
router.get("/", authMiddleware, adminMiddleware, getAllDownloads);

// User Route
router.get("/user/:userId", authMiddleware, getDownloadsByUser);

// Create Log Route (User or Admin can create)
router.post("/", authMiddleware, createDownloadLog);

export default router;
