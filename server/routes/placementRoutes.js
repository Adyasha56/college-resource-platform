// routes/placementRoutes.js
import express from 'express';
import {
  getAllPlacements,
  getPlacementById,
  createPlacement,
  updatePlacement,
  deletePlacement
} from '../controllers/placementController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (anyone can view placements)
router.get('/', getAllPlacements);
router.get('/:id', getPlacementById);

// Protected admin routes (require authentication)
router.post('/', protect, createPlacement);
router.put('/:id', protect, updatePlacement);
router.delete('/:id', protect, deletePlacement);

export default router;