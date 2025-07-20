import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import { Server } from "socket.io";
import "dotenv/config";
import bookRouter from "./routes/bookRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import userRouter from "./routes/userRoutes.js";
import authorRouter from "./routes/authorRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./middlewares/logger.js";
import { limiter } from "./middlewares/limiter.js";
import AppError from "./utils/appError.js";

const app = express();

// socket.io 


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(hpp());
app.use(logger);
app.use(
  cors({
    origin: "*", // The frontend
    credentials: true, // Allow cookies
  })
);
app.use(limiter);

// Serve static files from uploads directory with CORS headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", "false");
    next();
  },
  express.static("uploads")
);

// Routes
app.use("/api/v1/authors", authorRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reviews", reviewRouter);
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

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const gracefulShutdown = () => {
  server.close((err) => {
    if (err) {
      console.error("Error closing HTTP server:", err);
      return process.exit(1);
    }
    console.log("HTTP server closed.");
    // disconnect database
    mongoose
      .disconnect()
      .then(() => {
        console.log("Database disconnected.");
        process.exit(0);
      })
      .catch((error) => {
        console.error("Error during database disconnection:", error);
        process.exit(1);
      });
  });

  // set fallback timeout forcing connection termination
  setTimeout(() => {
    console.error("Time limit exceeded, forcing shutdown!");
    process.exit(1);
  }, 10000);
};

process.on("uncaughtException", (error: Error) => {
  console.log("Uncaught Exception Occurred", error.stack || error);
  gracefulShutdown();
});

process.on(
  "unhandledRejection",
  (reason: unknown, promise: Promise<unknown>) => {
    console.log("Unhandled Rejection", reason, promise);
    gracefulShutdown();
  }
);
