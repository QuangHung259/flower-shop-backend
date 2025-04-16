//controllers/categoryController.js
const Category = require("../models/Category");

// [1] Thêm danh mục mới
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res
      .status(201)
      .json({ message: "Danh mục đã được thêm!", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm danh mục", error });
  }
};

// [2] Lấy danh sách danh mục
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh mục", error });
  }
};

// [3] Lấy danh mục theo ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh mục", error });
  }
};

// [4] Cập nhật danh mục
const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory)
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res
      .status(200)
      .json({ message: "Cập nhật thành công", category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật danh mục", error });
  }
};

// [5] Xóa danh mục
const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory)
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.status(200).json({ message: "Xóa danh mục thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa danh mục", error });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
