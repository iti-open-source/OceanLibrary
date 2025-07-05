import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod/v4";
import AppError from "../utils/appError.js";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message });
  } else if (error instanceof ZodError) {
    // Format Zod validation errors into a readable message
    const errorMessages = error.issues
      .map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join(".") : "field";
        return `${path}: ${issue.message}`;
      })
      .join("; ");

    res.status(400).json({
      status: "fail",
      message: `Validation failed: ${errorMessages}`,
      details: error.issues,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: error ? error.message : "unexpected error",
    });
  }
};

export default errorHandler;
