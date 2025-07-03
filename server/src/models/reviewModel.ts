import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  username: { type: String },
  rating: { type: Number },
  comment: { type: String },
});

const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;
