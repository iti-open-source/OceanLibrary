import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import hpp from "hpp";
import "dotenv/config";
import bookRouter from "./routes/bookRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import userRouter from "./routes/userRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./middlewares/logger.js";
import AppError from "./utils/appError.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(hpp());
app.use(logger);

// Routes
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/users", userRouter);
// fallback route after express update
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

const { PORT, DB_URI } = process.env;

if (!DB_URI) {
  throw new Error("Missing DB_URI");
}

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Connection to database failed", error);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception Occurred", error.message);
  process.exit(1);
});

process.on(
  "unhandledRejection",
  (reason: unknown, promise: Promise<unknown>) => {
    console.error("Unhandled Rejection", promise, reason);
    process.exit(1);
  }
);
