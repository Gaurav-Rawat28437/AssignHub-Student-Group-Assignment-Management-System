
const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAllAssignments,
  updateAssignment,
  getMyAssignments,
  confirmSubmission,
  getAssignmentProgress
} = require("../controllers/assignmentController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, createAssignment);
router.get("/", protect, adminOnly, getAllAssignments);
router.put("/:id", protect, adminOnly, updateAssignment);
router.get("/my-assignments", protect, getMyAssignments);
router.get("/:id/progress", protect, adminOnly, getAssignmentProgress);
router.post("/:id/confirm", protect, confirmSubmission);

module.exports = router;
