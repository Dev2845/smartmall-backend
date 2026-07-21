const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../models/User");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const createAdmin = async () => {
  try {
    const admin = await User.findOne({
      email: "admin@smartmall.com",
    });

    if (admin) {
      console.log("Admin Already Exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "SmartMall Admin",
      email: "admin@smartmall.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    console.log("✅ Admin Created Successfully");
    process.exit();

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

createAdmin();