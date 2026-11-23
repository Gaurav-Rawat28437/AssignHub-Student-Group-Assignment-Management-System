const express = require("express");
const router = express.Router();

const { getDashboardAnalytics } = require("../controllers/analyticsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, adminOnly, getDashboardAnalytics);

module.exports = router;