import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "books",
    },
    title: {
      type: String,
      required: true,
    },
    image: {
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
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
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
    paymentMethod: {
      type: String,
      enum: ["cash", "paymob"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pendingPayment"],
      default: "pendingPayment",
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("orders", orderSchema);

export default orderModel;
