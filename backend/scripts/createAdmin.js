
require("dotenv").config();

const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.log("Admin environment variables not configured. Skipping.");
      return;
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: "AssignHub Admin",
        email,
        password: hashedPassword,
        role: "ADMIN"
      }
    });

    console.log("Admin created successfully:", email);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();
