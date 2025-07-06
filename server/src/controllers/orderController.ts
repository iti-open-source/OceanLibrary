import { Request, Response, NextFunction } from "express";
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import AppError from "../utils/appError.js";
import { CustomRequest } from "../middlewares/auth.js";
import mongoose from "mongoose";

/**
 * Place a new order
 * @param req - paymentMethod - paymob HMAC (if not COD)
 * @param res - Order details or Error
 */
export const placeOrder = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Prepare transcation session
  const session = await mongoose.startSession();

  try {
    const { paymentMethod } = req.body;
    let paymentStatus = "To be Shipped"; // Current payment status (pending for cod)
    const userId = req.userId;

    // Start transcation
    session.startTransaction();

    // Validate payment method
    const validPayments = ["cash", "paymob"];
    if (!validPayments.includes(paymentMethod)) {
      // Abort transcation
      await session.abortTransaction();
      session.endSession();

      throw Error("Order failed, payment method is not allowed");
    }

    // Verify paymob payment is successful
    if (paymentMethod === "paymob") {
      paymentStatus = "pendingPayment";
      // Generate payment link
    }

    // Get the current user's cart and fetch Books info from DB
    const cart: any = await cartModel.findById(userId).populate("items.bookId").session(session);

    // Lets check if there is items in the cart
    if (!cart || cart.items.length === 0) {
      // Abort transcation
      await session.abortTransaction();
      session.endSession();

      throw Error("Order failed, Cart is empty");
    }

    // Validate each book ordered
    let total = 0;
    const orderItems = [];
    for (const item of cart.items) {
      // Get current bookID
      const book: any = item.bookId;

      // Check if book Exists and if stock still available
      if (!book || book.stock < item.quantity) {
        // Abort transcation
        await session.abortTransaction();
        session.endSession();
        
        throw Error(
          "We are sorry but 1 or more Book is no longer available, your order will be canceled and refunded"
        );
      }

      // Calculate book cost
      const subtotal = book.price * item.quantity;
      // Add it to total cost
      total += subtotal;

      // Add the ordered book info at the time of order with title and image
      orderItems.push({
        bookId: book._id,
        title: book.title,
        image: book.image,
        price: book.price,
        quantity: item.quantity,
      });
    }

    // Create the order in the database
    const order: any = await orderModel.create([{
      userId,
      items: orderItems,
      total,
      status: "pending",
      paymentMethod,
      paymentStatus,
    }], { session });

    // Reduce our book stock in the DB
    for (const item of cart.items) {
      const book: any = item.bookId;
      book.stock -= item.quantity;
      await book.save({session});
    }

    // Clear the user's cart
    cart.items = [];
    await cart.save({ session });
    
    // commit transcation
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
      total: order.total,
      items: order.items,
      status: order.status,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

/**
 * Get all orders placed by a user
 * @param req - pageNumber, limitPerPage
 * @param res - Empty array or array of objects each has order
 */
export const viewOrder = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get userID
    const userId = req.userId;
    let { page, limit }: any = req.query;

    // Get number of page to display
    page = parseInt(page) || 1;

    // Limit of orders per page
    limit = parseInt(limit) || 10;

    // Offset skipper
    const skip = (page - 1) * limit;

    // Get orders list based on page limit
    const [orders, totalOrders] = await Promise.all([
      orderModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),
      orderModel.countDocuments({ userId }),
    ]);

    // Return orders list to client
    res.status(200).json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get details for specific order
 * @param req -
 * @param res
 */
export const viewOrderById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;
    const orderId = req.params.id;

    // Get order from DB
    const order = await orderModel.findOne({ _id: orderId, userId });

    if (!order) {
      return next(new AppError("order not found", 404));
    }
    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};
