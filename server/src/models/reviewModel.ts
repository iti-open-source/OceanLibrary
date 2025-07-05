import mongoose from "mongoose";
import { ReviewDocument } from "../types/entities/review.js";
import { Filter } from "bad-words";

const filter = new Filter();

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      set: (v: number) => Math.round(v),
    },
    reviewTitle: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 32,
    },
    reviewContent: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 256,
    },
    edited: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(
  "save",
  async function (
    this: ReviewDocument,
    next: mongoose.CallbackWithoutResultAndOptionalError
  ) {
    console.log("review pre save");

    if (!this.isModified("reviewTitle") && !this.isModified("reviewContent")) {
      next();
    }
    if (this.isModified("reviewTitle")) {
      this.reviewTitle = filter.clean(this.reviewTitle);
    }
    if (this.isModified("reviewContent")) {
      this.reviewContent = filter.clean(this.reviewContent);
    }
    next();
  }
);

const reviewModel = mongoose.model<ReviewDocument>("Review", reviewSchema);

export default reviewModel;
