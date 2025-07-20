import { Router } from "express";
import {
  viewOrder,
  viewOrderById,
  placeOrder,
  viewAllOrders,
  updateOrderStatus,
  deleteOrder,
  checkPaymobOrder,
} from "../controllers/orderController.js";
import { verifyToken } from "../middlewares/auth.js";
import { cacheMiddleware } from "../middlewares/cache.js";

const router = Router();

router.get("/paymobCheck/:id", verifyToken, checkPaymobOrder);
router.get("/view", verifyToken, viewOrder);
router.get("/view/:id", verifyToken, viewOrderById);
router.post("/", verifyToken, placeOrder);

router.get("/admin", viewAllOrders);
router.patch("/admin/:orderId", updateOrderStatus);
router.delete("/admin/:orderId", deleteOrder);

export default router;
