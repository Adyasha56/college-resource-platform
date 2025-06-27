import express from "express";
import {
  getAllPlacements,
  getPlacementById,
  createPlacement,
  updatePlacement,
  deletePlacement,
} from "../controllers/placementController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";


const router = express.Router();

// Public Routes
router.get("/", getAllPlacements);
router.get("/:id", getPlacementById);

// Admin Protected Routes
router.post("/", protect, isAdmin, createPlacement);
router.put("/:id", protect, isAdmin, updatePlacement);
router.delete("/:id", protect, isAdmin, deletePlacement);

export default router;
