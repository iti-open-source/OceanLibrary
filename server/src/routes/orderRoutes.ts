import { Router } from "express";
import {
  viewOrder,
  viewOrderById,
  placeOrder,
  viewAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", verifyToken, viewOrder);
router.get("/:id", verifyToken, viewOrderById);
router.post("/", verifyToken, placeOrder);

router.get("/admin", verifyToken, verifyAdmin, viewAllOrders);
router.patch("/admin/:orderId", verifyToken, verifyAdmin, updateOrderStatus);
router.delete("/admin/:orderId", verifyToken, verifyAdmin, deleteOrder);

export default router;
