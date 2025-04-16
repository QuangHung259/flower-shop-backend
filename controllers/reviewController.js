//controllers/reviewController.js
const Review = require("../models/Review");
const Product = require("../models/Product");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware"); // Import authMiddleware
const adminMiddleware = require("../middleware/adminMiddleware"); // Import adminMiddleware

// POST: Người dùng gửi đánh giá sản phẩm
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id; // Lấy user từ middleware authMiddleware

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Tạo một review mới
    const review = new Review({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({
      message: "Đánh giá thành công",
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// GET: Lấy tất cả đánh giá của một sản phẩm
const getReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await Review.find({ product: productId })
      .populate("user", "fullName") // Populating để lấy tên người dùng
      .populate("product", "name"); // Populating để lấy tên sản phẩm

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có đánh giá nào cho sản phẩm này" });
    }

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// PUT: Admin cập nhật đánh giá (cập nhật rating, comment)
const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;

    // Kiểm tra xem đánh giá có tồn tại không
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Đánh giá không tồn tại" });
    }

    // Cập nhật thông tin đánh giá
    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.json({
      message: "Cập nhật đánh giá thành công",
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// DELETE: Admin xóa đánh giá
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    // Kiểm tra xem đánh giá có tồn tại không
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Đánh giá không tồn tại" });
    }

    // Xóa đánh giá - thay thế remove() bằng findByIdAndDelete()
    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "Đánh giá đã được xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// GET: Admin lấy tất cả đánh giá
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "fullName")
      .populate("product", "name");
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
  getAllReviews,
};
