
const express = require("express");
const router = express.Router();

const {
  createGroup,
  addMember,
  getMyGroups,
  getGroupById
} = require("../controllers/groupController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createGroup);
router.get("/my-groups", protect, getMyGroups);
router.get("/:groupId", protect, getGroupById);
router.post("/:groupId/members", protect, addMember);

module.exports = router;
