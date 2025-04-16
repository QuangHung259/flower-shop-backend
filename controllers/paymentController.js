//controllers/paymentController.js
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const axios = require("axios");
const crypto = require("crypto");

const createMomoPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const userId = req.user._id;

    if (!orderId || !amount) {
      return res.status(400).json({ message: "Thiếu thông tin thanh toán" });
    }

    // Tạo bản ghi thanh toán trong DB
    const payment = await Payment.create({
      order: orderId,
      user: userId,
      amount,
      method: "momo",
      status: "pending",
    });

    // Gọi API Momo nếu bạn muốn tích hợp thật sự
    // Đây chỉ là mẫu dữ liệu, bạn cần đăng ký tài khoản Momo để có accessKey và secretKey
    /*
    const momoRes = await axios.post("https://test-payment.momo.vn/v2/gateway/api/create", {
      partnerCode: process.env.MOMO_PARTNER_CODE,
      accessKey: process.env.MOMO_ACCESS_KEY,
      requestId: `${Date.now()}`,
      amount: amount.toString(),
      orderId: orderId.toString(),
      orderInfo: "Thanh toán đơn hàng",
      returnUrl: "http://localhost:3000/payment-success",
      notifyUrl: "http://localhost:5000/api/payments/momo/callback",
      requestType: "captureWallet",
      signature: "HMAC_SIGNATURE_HERE" // Bạn cần ký dữ liệu này
    });
    */

    // Trả về kết quả (giả lập nếu chưa dùng API thật)
    res.status(201).json({
      message: "Tạo thanh toán Momo thành công (giả lập)",
      payment,
    });
  } catch (error) {
    console.error("Lỗi thanh toán:", error);
    res.status(500).json({ message: "Lỗi thanh toán", error: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "fullName email")
      .populate("order", "_id totalAmount status");
    res.json({ payments });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách thanh toán",
      error: err.message,
    });
  }
};

const handleMomoCallback = async (req, res) => {
  try {
    const {
      orderId,
      requestId,
      amount,
      resultCode,
      message,
      signature,
      extraData,
    } = req.body;

    // Xác thực chữ ký (nếu cần thiết)
    // const rawSignature = `...`; // Xây dựng chữ ký theo tài liệu Momo
    // const expectedSignature = crypto
    //   .createHmac("sha256", process.env.MOMO_SECRET_KEY)
    //   .update(rawSignature)
    //   .digest("hex");
    // if (signature !== expectedSignature) {
    //   return res.status(400).json({ message: "Chữ ký không hợp lệ" });
    // }

    const status = resultCode === 0 ? "completed" : "failed";

    // Cập nhật trạng thái thanh toán trong DB
    await Payment.findOneAndUpdate(
      { order: orderId },
      { status },
      { new: true }
    );

    console.log(
      `📩 Callback từ Momo: Đơn ${orderId} có trạng thái ${status} - ${message}`
    );

    // Gửi phản hồi cho Momo
    res.status(200).json({ message: "Callback Momo xử lý xong" });
  } catch (error) {
    console.error("❌ Callback Momo lỗi:", error);
    res.status(500).json({ message: "Lỗi callback", error: error.message });
  }
};

const getPaymentsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const payments = await Payment.find({ user: userId }).populate(
      "order",
      "_id totalAmount status"
    );
    res.json({ payments });
  } catch (err) {
    res.status(500).json({
      message: "Không thể lấy thanh toán người dùng",
      error: err.message,
    });
  }
};

const createCodPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const userId = req.user._id;

    if (!orderId || !amount) {
      return res.status(400).json({ message: "Thiếu thông tin thanh toán" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Tạo bản ghi thanh toán với trạng thái đã hoàn tất luôn
    const payment = await Payment.create({
      order: orderId,
      user: userId,
      amount,
      method: "cod",
      status: "completed",
    });

    res.status(201).json({
      message: "Thanh toán COD thành công",
      payment,
    });
  } catch (error) {
    console.error("Lỗi thanh toán COD:", error);
    res
      .status(500)
      .json({ message: "Lỗi thanh toán COD", error: error.message });
  }
};

module.exports = {
  createMomoPayment,
  getAllPayments,
  createCodPayment,
  handleMomoCallback,
  getPaymentsByUser, // Đảm bảo xuất hàm này
};
