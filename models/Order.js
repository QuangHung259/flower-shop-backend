//models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: { type: String },
  customerPhone: { type: String },
  customerEmail: { type: String },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "canceled"],
    default: "pending",
  },
  shippingAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
