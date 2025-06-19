import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: String,
    author: String,
    genres: [String],
    price: Number,
    description: String,
    stock: Number,
    reviews: [Schema.Types.ObjectId],
    image: String,
  },
  {
    timestamps: true,
  }
);

const bookModel = mongoose.model("book", bookSchema);

export default bookModel;
