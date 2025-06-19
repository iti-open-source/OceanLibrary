import mongoose from "mongoose";

// Item Schema
const itemSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "book",
  },
  title: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Order schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  items: {
    type: [itemSchema],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "shipped",
      "delivered",
      "completed",
      "cancelled",
      "rejected",
    ],
    default: "pending",
  },
});

// Order model
const orderModel = mongoose.model("orders", orderSchema);

// Export order model
export default orderModel;
