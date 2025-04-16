//routes/productRoutes.js
const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", authMiddleware, isAdmin, createProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

// Endpoint để upload hình ảnh cho sản phẩm
router.post("/upload", authMiddleware, upload.single("image"), (req, res) => {
  try {
    if (req.file) {
      return res.json({
        message: "Upload thành công",
        imageUrl: req.file.path, // Đường dẫn URL của ảnh đã upload lên Cloudinary
      });
    } else {
      return res.status(400).json({ message: "Không có file để upload" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi upload hình ảnh", error: error.message });
  }
});

module.exports = router;
