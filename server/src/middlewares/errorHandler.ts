import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod/v4";
import AppError from "../utils/appError.js";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message });
  } else if (error instanceof ZodError) {
    res.status(400).json({
      status: "fail",
      message: error.issues,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: error ? error.message : "unexpected error",
    });
  }
};

export default errorHandler;
