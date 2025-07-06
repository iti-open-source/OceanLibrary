import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Book",
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
      ref: "User",
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
      enum: ["pending", "paid"],
      default: "pending",
      required: false,
    },
    paymentLink: {
      type: String,
      default: "",
      required: false,
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
