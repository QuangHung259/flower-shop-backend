//routes/orderRoutes.js
const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserOrders,
} = require("../controllers/orderController");
const Order = require("../models/Order");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createOrder); //  User đăng nhập mới được tạo đơn
router.get("/my-orders", authMiddleware, getUserOrders); //
router.get("/:id", authMiddleware, getOrderById);
// Xem đơn theo id - cần login

router.get("/", authMiddleware, isAdmin, getOrders); // Admin xem tất cả đơn
router.put("/:id", authMiddleware, isAdmin, updateOrderStatus); // Admin cập nhật
router.delete("/:id", authMiddleware, isAdmin, deleteOrder); // Admin xóa

// Người dùng hủy đơn hàng của chính họ
router.put("/cancel/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const order = await Order.findOne({ _id: req.params.id, user: userId });

    if (!order)
      return res
        .status(404)
        .json({ message: "Không tìm thấy đơn hàng để hủy" });

    if (order.status !== "pending")
      return res
        .status(400)
        .json({ message: "Chỉ có thể hủy đơn đang chờ xử lý" });

    order.status = "canceled";
    await order.save();

    res.status(200).json({ message: "Đã hủy đơn hàng", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi hủy đơn hàng", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy danh mục", err });
  }
});

module.exports = router;

module.exports = router;
