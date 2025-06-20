import { Request, Response, NextFunction } from "express";
import AppError from "../utils/apiError.js";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message });
  } else {
    res
      .status(500)
      .json({ status: "server error", message: "Something went wrong" });
  }
};

export default errorHandler;
