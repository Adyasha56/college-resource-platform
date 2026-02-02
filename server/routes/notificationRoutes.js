import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getNotifications,
  getNotificationCount,
  deleteNotification,
  clearAllNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getNotifications);
router.get('/count', getNotificationCount);
router.delete('/', clearAllNotifications);
router.delete('/:id', deleteNotification);

export default router;
