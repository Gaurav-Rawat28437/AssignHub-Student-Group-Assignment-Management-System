require("dotenv").config();

const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    const email = "admin@assignhub.com";
    const password = "Admin@123";

    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name: "AssignHub Admin",
        email,
        password: hashedPassword,
        role: "ADMIN"
      }
    });

    console.log("Admin created successfully:", admin.email);
  } catch (error) {
    console.log("Error creating admin:", error.message);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();