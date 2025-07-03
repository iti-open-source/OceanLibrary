import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    items: {
      type: [itemSchema],
      required: true,
    },
  },
  { timestamps: true }
);

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;
