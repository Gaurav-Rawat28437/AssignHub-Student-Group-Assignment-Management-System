
const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAllAssignments,
  updateAssignment
} = require("../controllers/assignmentController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, createAssignment);
router.get("/", protect, adminOnly, getAllAssignments);
router.put("/:id", protect, adminOnly, updateAssignment);

module.exports = router;
