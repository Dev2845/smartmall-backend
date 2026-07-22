const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false
    },

    phone: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: null
    },

    otpExpire: {
      type: Date,
      default: null
    }

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);