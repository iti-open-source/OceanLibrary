import { Router } from "express";
import {
  viewCart,
  addToCart,
  updateCart,
} from "../controllers/cartController.js";

const router = Router();

router.get("/", viewCart);
router.post("/", addToCart);
router.patch("/", updateCart);

export default router;
