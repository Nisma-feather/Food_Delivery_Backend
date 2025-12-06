const brevo = require("../config/brevoEmail"); // Brevo API
const redisClient = require("../config/redis");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ------------------ SEND OTP ------------------
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    
    if (!email) return res.status(400).json({ message: "Email required" });

    const otp = Math.floor(10000 + Math.random() * 90000).toString();

    await redisClient.setEx(`otp:${email}`, 120, otp);

    // Send via Brevo API
   await brevo.sendTransacEmail({
     sender: { email: "shanthinifeathers16@gmail.com", name: "Feather Delivery App" },
     to: [{ email }],
     subject: "Your OTP Code",
     textContent: `
Hello,

This is your verification email for the Feather Delivery App.

Your OTP code is: ${otp}

Please do not share this OTP with anyone. It is valid for 2 minutes only.

Thank you,
Food Delivery App 
  `,
   });

    res.json({ message: "OTP sent successfully" });
  } catch (e) {
    console.error("Brevo Error:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

// ------------------ VERIFY OTP + CREATE USER ------------------
const verifyOtp = async (req, res) => {
  try {
    const { email, otp, password, userName, role } = req.body;

    const serverOtp = await redisClient.get(`otp:${email}`);
    if (!serverOtp) return res.status(400).json({ message: "OTP expired" });

    if (serverOtp !== otp)
      return res.status(401).json({ message: "Invalid OTP" });

    await redisClient.del(`otp:${email}`);

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      userName,
      password: hashPassword,
      signupType: "mail",
      role: role || "user",
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "OTP Verified & User Created",
      user: {
        userId: newUser._id,
        email: newUser.email,
        userName: newUser.userName,
        role: newUser.role,
      },
      token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Unable to verify OTP" });
  }
};

// ------------------ SEND FORGOT OTP ------------------
const sendForgotOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Not a registered email" });

    const otp = Math.floor(10000 + Math.random() * 90000).toString();

    await redisClient.setEx(`resetOtp:${email}`, 180, otp);

   await brevo.sendTransacEmail({
     sender: { email: "shanthinifeathers16@gmail.com", name: "Feather Delivery App" },
     to: [{ email }],
     subject: "Your OTP Code",
     textContent: `
Hello,

This is your verification email for the Feather Delivery App.

Your OTP code is: ${otp}

Please do not share this OTP with anyone. It is valid for 2 minutes only.

Thank you,
Feather Delivery App 
  `,
   });
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ------------------ VERIFY FORGOT OTP ------------------
const verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedOtp = await redisClient.get(`resetOtp:${email}`);
    if (!storedOtp) return res.status(400).json({ message: "OTP expired" });

    if (storedOtp !== otp)
      return res.status(401).json({ message: "Incorrect OTP" });

    await redisClient.setEx(`otpVerified:${email}`, 600, "true");
    await redisClient.del(`resetOtp:${email}`);

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ------------------ RESET PASSWORD ------------------
const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const otpVerified = await redisClient.get(`otpVerified:${email}`);
    if (!otpVerified)
      return res.status(400).json({ message: "OTP not verified" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await redisClient.del(`otpVerified:${email}`);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  sendForgotOtp,
  verifyForgotOtp,
  resetPassword,
};
