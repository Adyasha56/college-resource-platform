// server/routes/userManagementRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import {
  getAllUsers,
  getUserDetails,
  getUserStats
} from "../controllers/userManagementController.js";

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(isAdmin);

// Get all users with pagination and filtering
router.get("/", getAllUsers);

// Get user statistics (branch/year distribution)
router.get("/stats", getUserStats);

// Get single user details
router.get("/:userId", getUserDetails);

export default router;
