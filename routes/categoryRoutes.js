//routes/categoryRoutes.js
const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory); // 👈 Chỉ admin được thêm
router.get("/", getCategories); // Ai cũng xem được
router.get("/:id", getCategoryById);
router.put("/:id", authMiddleware, isAdmin, updateCategory); // 👈 Admin cập nhật
router.delete("/:id", authMiddleware, isAdmin, deleteCategory); // 👈 Admin xóa

module.exports = router;
