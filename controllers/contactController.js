// controllers/contactController.js
const Contact = require("../models/Contact");

const submitContact = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ message: "Liên hệ đã được gửi!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi gửi liên hệ", error });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách liên hệ", error });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
};
