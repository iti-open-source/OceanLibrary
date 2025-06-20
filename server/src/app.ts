import express from "express";

import bookRoutes from "./routes/bookRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/users", userRouter);

export default app;
