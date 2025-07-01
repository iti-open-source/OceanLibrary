import { Router } from "express";
import {
  viewCart,
  addToCart,
  updateCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/auth.js";
import ZodValidator from "../middlewares/zodValidator.js";
import { addToCartSchema } from "../utils/validation/cartValidation.js";

const router = Router();

router.get("/", verifyToken, viewCart);
router.post("/", ZodValidator(addToCartSchema), verifyToken, addToCart);
router.patch("/", verifyToken, updateCart);

export default router;
