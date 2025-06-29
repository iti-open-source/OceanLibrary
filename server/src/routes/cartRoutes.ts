import { Router } from "express";
import {
  viewCart,
  addToCart,
  updateCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", verifyToken, viewCart);
router.post("/", verifyToken, addToCart);
router.patch("/", verifyToken, updateCart);

export default router;
