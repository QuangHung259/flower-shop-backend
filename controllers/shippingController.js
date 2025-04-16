//controllers/shippingController.js
const Shipping = require("../models/Shipping");
const Order = require("../models/Order");

// POST: Tạo mới thông tin vận chuyển
const createShipping = async (req, res) => {
  try {
    const {
      orderId,
      carrier,
      trackingNumber,
      status,
      estimatedDelivery,
      actualDelivery,
    } = req.body;

    // Kiểm tra xem đơn hàng có tồn tại không
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Tạo thông tin vận chuyển
    const shipping = new Shipping({
      order: orderId,
      carrier,
      trackingNumber,
      status: status || "pending", // Mặc định là "pending"
      estimatedDelivery,
      actualDelivery,
    });

    await shipping.save();
    res.status(201).json({
      message: "Tạo thông tin vận chuyển thành công",
      shipping,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi tạo thông tin vận chuyển",
      error: error.message,
    });
  }
};

// GET: Lấy tất cả thông tin vận chuyển
const getAllShipping = async (req, res) => {
  try {
    const shippings = await Shipping.find().populate(
      "order",
      "_id totalAmount status"
    ); // Populating để lấy thông tin đơn hàng

    res.json({ shippings });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách vận chuyển",
      error: error.message,
    });
  }
};

// GET: Lấy thông tin vận chuyển theo ID đơn hàng
const getShippingByOrderId = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const shipping = await Shipping.findOne({ order: orderId }).populate(
      "order",
      "_id totalAmount status"
    );

    if (!shipping) {
      return res
        .status(404)
        .json({ message: "Không có thông tin vận chuyển cho đơn hàng này" });
    }

    res.json(shipping);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi lấy thông tin vận chuyển",
      error: error.message,
    });
  }
};

// PUT: Cập nhật thông tin vận chuyển
const updateShipping = async (req, res) => {
  try {
    const shippingId = req.params.shippingId;
    const {
      carrier,
      trackingNumber,
      status,
      estimatedDelivery,
      actualDelivery,
    } = req.body;

    const shipping = await Shipping.findById(shippingId);
    if (!shipping) {
      return res
        .status(404)
        .json({ message: "Thông tin vận chuyển không tồn tại" });
    }

    // Cập nhật thông tin vận chuyển
    shipping.carrier = carrier || shipping.carrier;
    shipping.trackingNumber = trackingNumber || shipping.trackingNumber;
    shipping.status = status || shipping.status;
    shipping.estimatedDelivery =
      estimatedDelivery || shipping.estimatedDelivery;
    shipping.actualDelivery = actualDelivery || shipping.actualDelivery;

    await shipping.save();
    res.json({
      message: "Cập nhật thông tin vận chuyển thành công",
      shipping,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin vận chuyển",
      error: error.message,
    });
  }
};

// DELETE: Xóa thông tin vận chuyển
const deleteShipping = async (req, res) => {
  try {
    const shippingId = req.params.shippingId;

    const shipping = await Shipping.findById(shippingId);
    if (!shipping) {
      return res
        .status(404)
        .json({ message: "Thông tin vận chuyển không tồn tại" });
    }

    await Shipping.findByIdAndDelete(shippingId);
    res.json({ message: "Thông tin vận chuyển đã được xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi xóa thông tin vận chuyển",
      error: error.message,
    });
  }
};

module.exports = {
  createShipping,
  getAllShipping,
  getShippingByOrderId,
  updateShipping,
  deleteShipping,
};
