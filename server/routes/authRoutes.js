// server/routes/authRoutes.js
import express from 'express';
import {
  registerStudent,
  loginStudent,
  loginAdmin
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.post('/admin-login', loginAdmin);

export default router;
