import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({});

const reviewModel = mongoose.model("reviews", reviewSchema);

export default reviewModel;
