
const prisma = require("../config/prisma");

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT"
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({
      message: "Students fetched successfully",
      count: students.length,
      students
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students",
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  getAllStudents
};
