//controllers/orderController.js
const Order = require("../models/Order");

// [1] Thêm đơn hàng mới
const createOrder = async (req, res) => {
  try {
    const {
      products,
      totalAmount,
      shippingAddress,
      customerName,
      customerPhone,
      customerEmail,
    } = req.body;

    if (!products || !totalAmount || !shippingAddress) {
      return res.status(400).json({ message: "Thiếu dữ liệu đầu vào!" });
    }
    // Kiểm tra số lượng sản phẩm là số dương
    if (
      !Array.isArray(products) ||
      products.some((p) => !p.product || p.quantity <= 0)
    ) {
      return res.status(400).json({ message: "Dữ liệu sản phẩm không hợp lệ" });
    }

    // Kiểm tra số tiền không âm
    if (totalAmount < 0) {
      return res.status(400).json({ message: "Tổng tiền không hợp lệ" });
    }

    // Không cần truy vấn lại user từ DB
    const user = req.user;

    const newOrder = new Order({
      user: user._id,
      customerName: customerName || user.fullName,
      customerPhone: customerPhone || user.phone,
      customerEmail: customerEmail || user.email,
      products,
      totalAmount,
      shippingAddress,
      status: "pending",
    });

    await newOrder.save();

    res.status(201).json({
      message: "Đơn hàng đã được tạo!",
      order: newOrder,
    });
  } catch (error) {
    console.error("LỖI KHI TẠO ĐƠN HÀNG:", error);
    res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error });
  }
};

// [2] Lấy danh sách đơn hàng
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName email")
      .populate({
        path: "products.product",
        select: "name price",
        match: { _id: { $exists: true } }, // Chỉ lấy sản phẩm hợp lệ
      });

    if (!orders.length) {
      return res.status(404).json({ message: "Không có đơn hàng nào" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// [3] Lấy chi tiết đơn hàng
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "fullName email")
      .populate({
        path: "products.product",
        select: "name price",
        match: { _id: { $exists: true } }, // Chỉ lấy sản phẩm tồn tại
      });

    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng", error });
  }
};

// [4] Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    res
      .status(200)
      .json({ message: "Cập nhật thành công", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật đơn hàng", error });
  }
};

// [5] Xóa đơn hàng
const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    res.status(200).json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa đơn hàng", error });
  }
};
// [6] Người dùng xem đơn hàng của chính họ
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "products.product",
        select: "name price image", // nhớ có image nếu bạn cần hiển thị
      });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng của người dùng:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Chỉ export 1 lần, sau khi khai báo tất cả hàm
module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserOrders,
};
