//routes/shippingRoutes.js
const express = require("express");
const {
  createShipping,
  getAllShipping,
  getShippingByOrderId,
  updateShipping,
  deleteShipping,
} = require("../controllers/shippingController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// POST: Tạo thông tin vận chuyển
router.post("/", authMiddleware, isAdmin, createShipping);

// GET: Lấy tất cả thông tin vận chuyển
router.get("/", authMiddleware, isAdmin, getAllShipping);

// GET: Lấy thông tin vận chuyển theo đơn hàng
router.get("/order/:orderId", authMiddleware, getShippingByOrderId);

// PUT: Cập nhật thông tin vận chuyển
router.put("/:shippingId", authMiddleware, isAdmin, updateShipping);

// DELETE: Xóa thông tin vận chuyển
router.delete("/:shippingId", authMiddleware, isAdmin, deleteShipping);

module.exports = router;
