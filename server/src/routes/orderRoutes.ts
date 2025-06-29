import { Router } from "express";
import {
  viewOrder,
  viewOrderById,
  placeOrder,
} from "../controllers/orderController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", verifyToken, viewOrder);
router.get("/:id", verifyToken, viewOrderById);
router.post("/", verifyToken, placeOrder);

export default router;
