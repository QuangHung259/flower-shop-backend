//models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
