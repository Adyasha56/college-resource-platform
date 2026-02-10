import express from "express";
import { loginAdmin, createAdmin, getDashboardStats } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/register", createAdmin);
router.get("/dashboard/stats", protect, isAdmin, getDashboardStats);

export default router;

