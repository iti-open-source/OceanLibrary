import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

// Extend Express Request interface to include userId
export interface CustomRequest extends Request {
  userId?: string;
}

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // extract token from authorization header: Bearer <token>
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token || !process.env.SECRET_KEY) {
      return next(new AppError("authentication failed", 401));
    }
    // assign decoded data to request
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (typeof decoded === "string" || !decoded.userId) {
      return next(new AppError("invalid token", 401));
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};
