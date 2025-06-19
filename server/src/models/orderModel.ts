import mongoose from "mongoose";

// Item Schema
const itemSchema = new mongoose.Schema(
  {
    // The BookID refernced from Book Collection
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "book",
    },
    // Book title at the time the user made the order
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    // The ordered quantity
    quantity: {
      type: Number,
      required: true,
    },
    // The price at the time the order was made
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

// Order schema
const orderSchema = new mongoose.Schema(
  {
    // User ID
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    // Number of ordered items
    items: {
      type: [itemSchema],
      required: true,
    },
    // Total amount
    total: {
      type: Number,
      required: true,
    },
    // Current order status
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
  },
  // Store order update time
  { timestamps: true }
);

// Order model
const orderModel = mongoose.model("orders", orderSchema);

// Export order model
export default orderModel;
