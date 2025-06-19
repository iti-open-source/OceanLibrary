import { Router } from "express";
import orderController from "../controllers/orderController.js";

const orderRouter = Router();

// View current orders
orderRouter.get("/", orderController.viewOrder);

// View spesfic order
orderRouter.get("/:id", orderController.viewOrderById);

// Place a new order
orderRouter.post("/", orderController.placeOrder);

// Export router
export default orderRouter;
