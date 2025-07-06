import { Router } from "express";
import {
  viewCart,
  addToCart,
  updateCart,
  deleteCart,
  removeFromCart,
  mergeCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/auth.js";
import ZodValidator from "../middlewares/zodValidator.js";
import {
  addToCartSchema,
  mergeCartSchema,
  modifyCartSchema,
} from "../utils/validation/cartValidation.js";
import { checkGuestId } from "../middlewares/guest.js";

const router = Router();

// Retrieve Guest or User cart
router.get("/", checkGuestId, verifyToken, viewCart);

// Add new items into Guest or user cart
router.post(
  "/",
  ZodValidator(addToCartSchema),
  checkGuestId,
  verifyToken,
  addToCart
);

// Modify quantity for specific item in cart
router.patch(
  "/",
  ZodValidator(modifyCartSchema),
  checkGuestId,
  verifyToken,
  updateCart
);

// Delete specific item in the cart
router.delete("/item", checkGuestId, verifyToken, removeFromCart);

// Delete the entire cart (clear)
router.delete("/", checkGuestId, verifyToken, deleteCart);

// Merge guest's cart with user's cart
router.post("/merge", ZodValidator(mergeCartSchema), verifyToken, mergeCart);

export default router;
