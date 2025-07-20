import express from "express";
import { getDashboardStats } from "../controllers/analyticsController.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Dashboard statistics
router.get("/dashboard", verifyToken, verifyAdmin, getDashboardStats);

export default router;
