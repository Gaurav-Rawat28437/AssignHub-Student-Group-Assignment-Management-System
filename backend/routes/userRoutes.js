
const express = require("express");

const router = express.Router();

const {
  getProfile,
  getAllStudents
} = require("../controllers/userController");

const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");

router.get("/profile", protect, getProfile);

router.get("/students", protect, adminOnly, getAllStudents);

module.exports = router;
