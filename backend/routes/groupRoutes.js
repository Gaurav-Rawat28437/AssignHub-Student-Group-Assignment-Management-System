
const express = require("express");
const router = express.Router();

const {
  createGroup,
  addMember,
  getMyGroups,
  getGroupById,
  deleteGroup
} = require("../controllers/groupController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createGroup);
router.get("/my-groups", protect, getMyGroups);
router.get("/:groupId", protect, getGroupById);
router.post("/:groupId/members", protect, addMember);
router.delete("/:groupId", protect, deleteGroup);

module.exports = router;
