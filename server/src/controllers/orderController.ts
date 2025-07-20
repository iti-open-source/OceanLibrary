import { Response, NextFunction } from "express";
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import AppError from "../utils/appError.js";
import { CustomRequest } from "../middlewares/auth.js";
import mongoose from "mongoose";
import { generatePaymobPaymentLink, isOrderPaid } from "../utils/payments/paymobSDK.js";
import redisClient from "../utils/redisClient.js";
import { io } from "../server.js";

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
  // Prepare transaction session
  const session = await mongoose.startSession();

  try {
    const { paymentMethod } = req.body;
    let paymentStatus = "pending"; // Current payment status (pending for cod)
    let paymentLink: string | null = null;
    let paymentOrderId: string | null = null;
    const userId = req.userId;

    // Start transaction
    session.startTransaction();

    // Validate payment method
    const validPayments = ["cash", "paymob"];
    if (!validPayments.includes(paymentMethod)) {
      // Abort transaction
      throw Error("Order failed, payment method is not allowed");
    }

    // Get the current user's cart and fetch Books info from DB
    const cart: any = await cartModel
      .findById(userId)
      .populate("items.bookId")
      .session(session);

    // Lets check if there is items in the cart
    if (!cart || cart.items.length === 0) {
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
        // Abort transaction
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

    // Verify paymob payment is successful
    if (paymentMethod === "paymob") {
      paymentStatus = "pending";
      let paymob: any = await generatePaymobPaymentLink(total);
      if (!paymob.iframeURL) {
        // Abort transaction
        throw Error(
          "Order failed, unable to generate payment link. Please try again later."
        );
      }
      paymentOrderId = paymob.orderId;
      paymentLink = paymob.iframeURL;
    }

    // Create the order in the database
    const order: any = await orderModel.create(
      [
        {
          userId,
          items: orderItems,
          total,
          status: "pending",
          paymentMethod,
          paymentStatus,
          paymentLink,
          paymentOrderId,
        },
      ],
      { session }
    );

    // Reduce our book stock in the DB
    for (const item of cart.items) {
      const book: any = item.bookId;
      book.stock -= item.quantity;
      await book.save({ session });
    }

    // Clear the user's cart
    cart.items = [];
    await cart.save({ session });

    // commit transaction
    await session.commitTransaction();
    session.endSession();

    io.emit("new-order", {
      orderId: order._id,
      message: "new order placed",
    });

    redisClient.flushAll();
    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
      total: order.total,
      items: order.items,
      status: order.status,
      ...(paymentLink && { paymentLink }),
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

/**
 * Admin endpoints
 * Get all orders placed by all users
 */
export const viewAllOrders = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get userID
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
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),
      orderModel.countDocuments({ _id: { $exists: true } }),
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

export const updateOrderStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    redisClient.flushAll();
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findByIdAndDelete(orderId);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    redisClient.flushAll();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};


export const checkPaymobOrder = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;
    const orderId = req.params.id;

    // 1. Get order from DB
    const order = await orderModel.findOne({ _id: orderId, userId });

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    // 2. Check if it's a Paymob order with a paymentOrderId
    if (!order.paymentLink || !order.paymentOrderId) {
      return next(new AppError("Payment link not available", 400));
    }

    // 3. Check Paymob payment status
    const isPaid = await isOrderPaid(order.paymentOrderId);

    // 4. If paid, update DB
    if (isPaid && order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      await order.save();
      redisClient.flushAll(); // Invalidate cache if you're using it
    }

    res.status(200).json({
      message: "Order payment status checked",
      paid: isPaid,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    next(error);
  }
};
