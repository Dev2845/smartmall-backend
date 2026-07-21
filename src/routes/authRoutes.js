const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  logout,forgotPassword,verifyOTP,resetPassword
} = require("../controllers/authController");

const {
  verifyToken,
  isAdmin,
} = require("../middlewares/authMiddleware");

// ===========================
// Public Routes
// ===========================

// Register User
router.post("/register", registerUser);

// Login (User + Admin)
router.post("/login", loginUser);

// ===========================
// User Protected Routes
// ===========================

// Get Profile
router.get("/profile", verifyToken, getProfile);

// Update Profile
router.put("/profile", verifyToken, updateProfile);

// Change Password
router.put("/change-password", verifyToken, changePassword);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Logout
router.post("/logout", verifyToken, logout);

// ===========================
// Admin Protected Routes
// ===========================

router.get("/admin/dashboard", verifyToken, isAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to SmartMall Admin Dashboard",
    admin: req.user,
  });
});

module.exports = router;