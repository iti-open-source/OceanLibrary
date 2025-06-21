import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bookRouter from "./routes/bookRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import userRouter from "./routes/userRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

// Routes
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/users", userRouter);

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
