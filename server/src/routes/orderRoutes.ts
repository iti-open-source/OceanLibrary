import { Router } from "express";
import {
  viewOrder,
  viewOrderById,
  placeOrder,
  viewAllOrders,
  updateOrderStatus,
  deleteOrder,
  checkPaymobOrder,
  cancelOrderById,
} from "../controllers/orderController.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.js";
import { cacheMiddleware } from "../middlewares/cache.js";

const router = Router();

router.get("/paymobCheck/:id", verifyToken, checkPaymobOrder);
router.get("/view", verifyToken, viewOrder);
router.get("/view/:id", verifyToken, viewOrderById);
router.get("/cancel/:id", verifyToken, cancelOrderById);
router.post("/", verifyToken, placeOrder);

router.get("/admin", verifyToken, verifyAdmin, viewAllOrders);
router.patch("/admin/:orderId", verifyToken, verifyAdmin, updateOrderStatus);
router.delete("/admin/:orderId", verifyToken, verifyAdmin, deleteOrder);

export default router;
