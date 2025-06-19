import mongoose from "mongoose";
import { Request, Response } from "express";

// Add item to cart
async function addToCart(req: Request, res: Response): Promise<void> {}

// Remove item from cart
async function updateCart(req: Request, res: Response): Promise<void> {}

// Display cart items
async function viewCart(req: Request, res: Response): Promise<void> {}

// Export cartController
const cartController = {
  addToCart,
  updateCart,
  viewCart,
};
export default cartController;
