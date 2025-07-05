import mongoose, { Document, HydratedDocument } from "mongoose";

export interface IReview extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  bookId: mongoose.Schema.Types.ObjectId;
  rating: number;
  reviewTitle: string;
  reviewContent: string;
  edited: boolean;
}

export type ReviewDocument = HydratedDocument<IReview>;
