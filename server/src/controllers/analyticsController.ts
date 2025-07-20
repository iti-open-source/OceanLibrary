import { Request, Response, NextFunction } from "express";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Author from "../models/authorModel.js";
import AppError from "../utils/appError.js";
import { DashboardStats } from "../types/analytics.js";

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const now = new Date();
    const last6Months = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Overview Statistics
    const [totalBooks, totalUsers, totalAuthors, totalOrders] =
      await Promise.all([
        Book.countDocuments(),
        User.countDocuments({ role: { $ne: "admin" } }),
        Author.countDocuments(),
        Order.countDocuments(),
      ]);

    // Revenue and pending orders
    const [revenueResult, pendingOrders] = await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.countDocuments({ status: "pending" }),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    // Recent Activity
    const [recentOrders, recentUsers, recentBooks] = await Promise.all([
      Order.find()
        .populate("userId", "username email")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("_id total status paymentStatus createdAt"),
      User.find({ role: { $ne: "admin" } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("username email createdAt"),
      Book.find()
        .populate("authorID", "name")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title price createdAt"),
    ]);

    // Monthly Revenue Chart (Last 6 months)
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last6Months },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Order Status Distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Top Books (by order quantity)
    const topBooks = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.bookId",
          title: { $first: "$items.title" },
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // Top Authors (by books sold)
    const topAuthors = await Book.aggregate([
      {
        $lookup: {
          from: "orders",
          let: { bookId: "$_id" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $eq: ["$items.bookId", "$$bookId"] } } },
            {
              $group: {
                _id: "$$bookId",
                totalSold: { $sum: "$items.quantity" },
              },
            },
          ],
          as: "sales",
        },
      },
      {
        $lookup: {
          from: "authors",
          localField: "authorID",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$authorID",
          authorName: { $first: "$author.name" },
          totalSold: {
            $sum: { $ifNull: [{ $arrayElemAt: ["$sales.totalSold", 0] }, 0] },
          },
          booksCount: { $sum: 1 },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // User Growth (Last 6 months)
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: last6Months },
          role: { $ne: "admin" },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Payment Method Distribution
    const paymentMethodDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
    ]);

    const dashboardStats: DashboardStats = {
      overview: {
        totalBooks,
        totalUsers,
        totalAuthors,
        totalOrders,
        totalRevenue,
        pendingOrders,
      },
      recentActivity: {
        recentOrders,
        recentUsers,
        recentBooks,
      },
      charts: {
        monthlyRevenue,
        orderStatusDistribution,
        topBooks,
        topAuthors,
        userGrowth,
        paymentMethodDistribution,
      },
    };

    res.status(200).json({
      status: "success",
      data: dashboardStats,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return next(new AppError("Failed to fetch dashboard statistics", 500));
  }
};
