//server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load biến môi trường từ .env
dotenv.config();

// Kết nối Database ( Chạy trước khi import models)
connectDB();

// Khởi tạo ứng dụng Express
const app = express();
app.use(express.json());
app.use(cors());

// Import Routes
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const shippingRoutes = require("./routes/shippingRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Sử dụng routes API
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/contact", contactRoutes);

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error("Lỗi chi tiết:", err);
  res.status(500).json({ message: "Lỗi server", error: err.message });
});

// Route mặc định
app.get("/", (req, res) => {
  res.send(" API Flower Shop Running...");
});

// Khai báo PORT đúng cách
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server chạy tại http://localhost:${PORT}`);
});

console.log("SECRET_KEY:", process.env.SECRET_KEY);
