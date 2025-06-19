import { Request, Response } from "express";
import orderModel from "../models/orderModel.js";

// Place a new order
async function placeOrder(req: Request, res: Response): Promise<void> {}

// View order history
async function viewOrder(req: Request, res: Response): Promise<void> {}

// Export controllers
const orderController = {
  placeOrder,
  viewOrder,
};
export default orderController;
