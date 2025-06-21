import { Router } from "express";
import {
  viewOrder,
  viewOrderById,
  placeOrder,
} from "../controllers/orderController.js";

const router = Router();

router.get("/", viewOrder);
router.get("/:id", viewOrderById);
router.post("/", placeOrder);

export default router;
