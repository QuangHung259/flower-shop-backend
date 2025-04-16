//controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ fullName, email, passwordHash, phone });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Tài khoản không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không đúng" });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.status(200).json({ message: "Cập nhật vai trò thành công", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật vai trò", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xoá người dùng", error });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng cá nhân", error });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const { fullName, phone, address } = req.body;

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật thông tin", error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  updateUserRole,
  deleteUser,
  getMyOrders,
  updateUserProfile,
};
