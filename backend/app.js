
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);

app.use("/api/assignments", assignmentRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Joineazy API is running"
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const prisma = require("./config/prisma");

    await prisma.$connect();

    res.status(200).json({
      message: "Database connected successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message
    });
  }
});

module.exports = app;
