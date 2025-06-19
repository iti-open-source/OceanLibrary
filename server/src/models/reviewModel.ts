import mongoose from "mongoose";

// Review Schema
const reviewSchema = new mongoose.Schema({});

// Review model
const reviewModel = mongoose.model("reviews", reviewSchema);

// Export review model
export default reviewModel;
