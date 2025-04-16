//routes/reviewRoutes.js
const express = require("express");
const {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
  getAllReviews,
} = require("../controllers/reviewController");
const { authMiddleware } = require("../middleware/authMiddleware"); // authMiddleware
const adminMiddleware = require("../middleware/adminMiddleware"); // adminMiddleware

const router = express.Router();

// POST: Người dùng gửi đánh giá sản phẩm (authMiddleware)
router.post("/", authMiddleware, createReview);

// GET: Lấy tất cả đánh giá của một sản phẩm
router.get("/:productId", getReviewsByProduct);

// PUT: Admin cập nhật đánh giá (adminMiddleware)
router.put("/:reviewId", authMiddleware, adminMiddleware, updateReview);

// DELETE: Admin xóa đánh giá (adminMiddleware)
router.delete("/:reviewId", authMiddleware, adminMiddleware, deleteReview);

router.get("/all", authMiddleware, adminMiddleware, getAllReviews);

module.exports = router;
