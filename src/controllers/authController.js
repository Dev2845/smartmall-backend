const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone
        } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({

                success: false,
                message: "All fields are required"

            });

        }

        const emailExists = await User.findOne({

            email

        });

        if (emailExists) {

            return res.status(400).json({

                success: false,
                message: "Email already exists"

            });

        }

        const hashPassword = await bcrypt.hash(password,10);

        const user = await User.create({

            name,

            email,

            password: hashPassword,

            phone

        });

        const token = generateToken(user);

        res.status(201).json({

            success:true,

            message:"Registration Successful",

            token,

            user:{

                id:user._id,

                name:user.name,

                email:user.email,

                role:user.role

            }

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

}

exports.loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required"
      });
    }

    // Find User
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password"
      });
    }

    // Check Status
    if (!user.status) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked"
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password"
      });
    }

    // Generate Token
    const token = generateToken(user);

    // Remove Password
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.updateProfile = async (req, res) => {

  try {

    const { name, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    user.name = name || user.name;

    user.phone = phone || user.phone;

    await user.save();

    res.status(200).json({

      success: true,

      message: "Profile Updated Successfully",

      user

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.changePassword = async (req, res) => {

  try {

    const {

      oldPassword,

      newPassword

    } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    const match = await bcrypt.compare(

      oldPassword,

      user.password

    );

    if (!match) {

      return res.status(400).json({

        success: false,

        message: "Old Password is incorrect"

      });

    }

    user.password = await bcrypt.hash(newPassword,10);

    await user.save();

    res.status(200).json({

      success: true,

      message: "Password Changed Successfully"

    });

  }

  catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

exports.logout = async (req,res)=>{

    res.status(200).json({

        success:true,

        message:"Logout Successful"

    });

}

exports.forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    // Check Email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate 6 Digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP Expiry (5 Minutes)
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP
    user.otp = otp;
    user.otpExpire = otpExpire;

    await user.save();

    // Send Email
    await sendEmail(
      user.email,
      "SmartMall Password Reset OTP",
      `Your OTP is ${otp}. It will expire in 5 minutes.`
    );

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email."
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.verifyOTP = async (req, res) => {
  try {

    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Check Expiry
    if (!user.otpExpire || user.otpExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired"
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP Verified Successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.resetPassword = async (req, res) => {
  try {

    const { email, otp, newPassword } = req.body;

    // Validation
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and New Password are required"
      });
    }

    // Password Length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    // Find User
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Check Expiry
    if (!user.otpExpire || user.otpExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired"
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // Clear OTP
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
