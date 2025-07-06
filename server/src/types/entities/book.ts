import mongoose, { Document, HydratedDocument } from "mongoose";

export interface IBook extends Document {
  title: string;
  authorName: string;
  authorID: mongoose.Types.ObjectId;
  genres: string[];
  price: number;
  pages: number;
  description: string;
  stock: number;
  ratingAverage?: number;
  ratingQuantity?: number;
  image: string;
}

export type BookDocument = HydratedDocument<IBook>;
