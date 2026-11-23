
const express = require("express");
const router = express.Router();

const { createAssignment } = require("../controllers/assignmentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, createAssignment);

module.exports = router;
