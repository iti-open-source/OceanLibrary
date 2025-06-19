import mongoose from "mongoose";

// Cart Schema
const cartSchema = new mongoose.Schema({});

// Cart Model
const cartModel = mongoose.model("cart", cartSchema);

// Export model
export default cartModel;
