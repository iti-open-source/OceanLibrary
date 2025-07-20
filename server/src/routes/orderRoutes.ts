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

router.get("/view", verifyToken, viewOrder);
router.get("/view/:id", verifyToken, viewOrderById);
router.post("/", verifyToken, placeOrder);

router.get("/admin", viewAllOrders);
router.patch("/admin/:orderId", updateOrderStatus);
router.delete("/admin/:orderId", deleteOrder);

export default router;
