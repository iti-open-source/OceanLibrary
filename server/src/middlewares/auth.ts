import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import AppError from "../utils/appError.js";

const { SECRET_KEY } = process.env;

// Extend Express Request interface to include userId
export interface CustomRequest extends Request {
  token: string | jwt.JwtPayload;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // authorization header: Bearer <token>
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token || !SECRET_KEY) {
      return next(new AppError("authentication failed", 401));
    }
    // assign decoded data to request
    (req as CustomRequest).token = jwt.verify(token, SECRET_KEY);
    next();
  } catch (error) {
    next(error);
  }
};
