import express from "express";
import { getRecommendations, refreshRecommendations } from "../controllers/recommendationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/recommendations - Get recommendations (cached or fresh)
router.get("/", protect, getRecommendations);

// POST /api/recommendations/refresh - Force refresh recommendations
router.post("/refresh", protect, refreshRecommendations);

export default router;
