//middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
  }
  next();
};

module.exports = adminMiddleware;
