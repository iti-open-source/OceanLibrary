import { Router } from "express";
import {
  viewOrder,
  viewOrderById,
  placeOrder,
  viewAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { verifyToken } from "../middlewares/auth.js";
import { cacheMiddleware } from "../middlewares/cache.js";

const router = Router();

router.get("/view", cacheMiddleware(600), verifyToken, viewOrder);
router.get("/view/:id", verifyToken, cacheMiddleware(600), viewOrderById);
router.post("/", verifyToken, placeOrder);

router.get("/admin", cacheMiddleware(300), viewAllOrders);
router.patch("/admin/:orderId", updateOrderStatus);
router.delete("/admin/:orderId", deleteOrder);

export default router;
