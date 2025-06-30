import { Schema } from "mongoose";
export interface IBook {
  title: string;
  author: Schema.Types.ObjectId;
  genres: string[];
  price: number;
  description: string;
  stock: number;
  ratingAverage?: number;
  ratingQuantity?: number;
  image: string;
}
