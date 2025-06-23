import express from "express";
import {
  getAllPlacements,
  getPlacementById,
  createPlacement,
  updatePlacement,
  deletePlacement,
} from "../controllers/placementController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllPlacements);
router.get("/:id", getPlacementById);

// Admin Protected Routes
router.post("/", authMiddleware, adminMiddleware, createPlacement);
router.put("/:id", authMiddleware, adminMiddleware, updatePlacement);
router.delete("/:id", authMiddleware, adminMiddleware, deletePlacement);

export default router;
