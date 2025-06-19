import { Router } from "express";
import cartController from "../controllers/cartController.js";

const cartRouter = Router();

// display items in cart
cartRouter.get("/", cartController.viewCart);

// Add items to cart
cartRouter.post("/", cartController.addToCart);

// Update items in cart
cartRouter.patch("/", cartController.updateCart);

// Export Cart Router
export default cartRouter;
