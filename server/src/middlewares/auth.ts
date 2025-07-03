import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

// Extend Express Request interface to include userId
export interface CustomRequest extends Request {
  userId?: string;
  userRole?: string;
  isGuest?: boolean;
}

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if the request is made by a guest user and has been verifyed by guest middleware
    if (req.isGuest && req.userId) {
      return next();
    }
    // extract token from authorization header: Bearer <token>
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token || !process.env.SECRET_KEY) {
      return next(new AppError("authentication failed", 401));
    }
    // assign decoded data to request
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (typeof decoded === "string" || !decoded.userId || !decoded.userRole) {
      return next(new AppError("invalid token", 401));
    }
    req.userId = decoded.userId;
    req.userRole = decoded.userRole;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.userRole !== "admin") {
      return next(new AppError("requires admin privileges", 401));
    }
    next();
  } catch (error) {
    next(error);
  }
};
