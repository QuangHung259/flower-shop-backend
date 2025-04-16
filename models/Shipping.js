//models/Shipping.js
const mongoose = require("mongoose");

const ShippingSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  carrier: { type: String },
  trackingNumber: { type: String },
  status: {
    type: String,
    enum: ["pending", "in_transit", "delivered"],
    default: "pending",
  },
  estimatedDelivery: { type: Date },
  actualDelivery: { type: Date },
});

module.exports = mongoose.model("Shipping", ShippingSchema);
