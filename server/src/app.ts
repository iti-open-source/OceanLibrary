import express from "express";

import bookRoutes from "./routes/bookRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/books", bookRoutes);

// Apply cart Router
app.use("/cart", cartRouter);

// Apply review Router
app.use("/reviews", reviewRouter);

// Apply order Router
app.use("/orders", orderRouter);

export default app;
