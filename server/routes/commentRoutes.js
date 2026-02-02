import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  updateComment,
  deleteComment,
  toggleCommentLike
} from '../controllers/commentController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.put('/:id', updateComment);
router.delete('/:id', deleteComment);
router.post('/:id/like', toggleCommentLike);

export default router;
