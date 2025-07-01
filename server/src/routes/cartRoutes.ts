import { Router } from "express";
import {
  viewCart,
  addToCart,
  updateCart,
  deleteCart,
  removeFromCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/auth.js";
import ZodValidator from "../middlewares/zodValidator.js";
import {
  addToCartSchema,
  ModfiyCartSchema,
} from "../utils/validation/cartValidation.js";

const router = Router();

router.get("/", verifyToken, viewCart);
router.post("/", ZodValidator(addToCartSchema), verifyToken, addToCart);
router.patch("/", ZodValidator(ModfiyCartSchema), verifyToken, updateCart);
router.delete("/", verifyToken, deleteCart);
router.delete("/item", verifyToken, removeFromCart);

export default router;
