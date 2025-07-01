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
import { checkGuestId } from "../middlewares/guest.js";

const router = Router();

router.get("/", checkGuestId, verifyToken, viewCart);
router.post(
  "/",
  ZodValidator(addToCartSchema),
  checkGuestId,
  verifyToken,
  addToCart
);
router.patch(
  "/",
  ZodValidator(ModfiyCartSchema),
  checkGuestId,
  verifyToken,
  updateCart
);
router.delete("/", verifyToken, checkGuestId, deleteCart);
router.delete("/item", verifyToken, checkGuestId, removeFromCart);

export default router;
