require("dotenv").config();

const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

const resetPassword = async () => {
  try {
    const hashedPassword = await bcrypt.hash("Gaurav@123", 10);

    const user = await prisma.user.update({
      where: {
        email: "gaurav@gmail.com"
      },
      data: {
        password: hashedPassword
      }
    });

    console.log("Password reset successfully for:", user.email);
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
};

resetPassword();