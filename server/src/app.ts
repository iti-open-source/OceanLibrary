import express from "express";

import bookRoutes from "./routes/bookRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/cart", cartRouter);
app.use("/reviews", reviewRouter);
app.use("/orders", orderRouter);
app.use("/api/users", userRouter);

export default app;
