import mongoose from "mongoose";

// Item Schema
const itemSchema = new mongoose.Schema(
  {
    // Book ID referenced from bookModel
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
    // Quantity of that book
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  // We don't need to generate doucment ID for every item as we use bookID
  { _id: false }
);

// Cart Schema
const cartSchema = new mongoose.Schema(
  {
    // Doucment Id will be userID
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // Items will be array of an itemSchema object
    items: {
      type: [itemSchema],
      required: true,
    },
  },
  // Store timestamp every time cart gets updated
  { timestamps: true }
);

// Cart Model
const cartModel = mongoose.model("cart", cartSchema);

// Export model
export default cartModel;
