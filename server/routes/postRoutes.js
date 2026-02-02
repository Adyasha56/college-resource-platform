import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  togglePostLike,
  uploadImages
} from '../controllers/postController.js';
import { addComment } from '../controllers/commentController.js';
import { uploadPostImages } from '../config/cloudinary.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Post routes
router.get('/', getPosts);
router.post('/', createPost);
router.post('/upload', uploadPostImages.array('images', 5), uploadImages);

router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', togglePostLike);

// Comment route (nested under post)
router.post('/:postId/comments', addComment);

export default router;
