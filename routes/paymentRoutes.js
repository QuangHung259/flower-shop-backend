//routes/paymentRoutes.js
const express = require("express");
const {
  createMomoPayment,
  getAllPayments,
  handleMomoCallback,
  getPaymentsByUser,
  createCodPayment,
} = require("../controllers/paymentController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/payments/cod
router.post("/cod", authMiddleware, createCodPayment);

// Tạo thanh toán bằng Momo
router.post("/momo", authMiddleware, createMomoPayment);

// Lấy danh sách thanh toán (tùy bạn muốn public hay admin-only)
//router.get("/", authMiddleware, getAllPayments);

router.get("/", authMiddleware, isAdmin, getAllPayments);
router.get("/user/:userId", authMiddleware, getPaymentsByUser);

router.post("/momo/callback", handleMomoCallback); // Momo sẽ gọi đến route này

module.exports = router;
