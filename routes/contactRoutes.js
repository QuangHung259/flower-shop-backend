// routes/contactRoutes.js
const express = require("express");
const {
  submitContact,
  getAllContacts,
} = require("../controllers/contactController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", submitContact);
router.get("/", authMiddleware, isAdmin, getAllContacts); // Admin mới xem được

module.exports = router;
