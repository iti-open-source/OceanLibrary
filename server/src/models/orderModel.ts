import mongoose from "mongoose";

// Order schema
const orderSchema = new mongoose.Schema({});

// Order model
const orderModel = mongoose.model("orders", orderSchema);

// Export order model
export default orderModel;
