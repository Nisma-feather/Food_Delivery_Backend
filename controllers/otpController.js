const transporter = require("../config/email");
const redisClient = require("../config/redis");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const otp = Math.floor(10000 + Math.random() * 90000).toString();

    // Store in Redis for 2 minutes
    await redisClient.setEx(`otp:${email}`, 120, otp);

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP code is ${otp}. It will expire in 2 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server Error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp, password, userName, role } = req.body; 
    console.log(otp)
    // Get OTP from Redis
    const serverOtp = await redisClient.get(`otp:${email}`);
    if (!serverOtp) {
      return res.status(400).json({ message: "OTP expired, try again" });
    }

    if (serverOtp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    await redisClient.del(`otp:${email}`);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
   const hashPassword = await bcrypt.hash(password, 10);

// Create user with role
const newUser = await User.create({
  email,
  userName,
  password: hashPassword,
  signupType: "mail",
  role: role || "user",
});

    // Generate token

    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role, 
        name: newUser.userName
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "OTP verified successfully & user account created",
      user: {
        userId: newUser._id,
        email: newUser.email,
        userName: newUser.userName,
        role: newUser.role,
      },
      token,
    });
  } catch (e) {
    console.error("Error verifying OTP:", e);
    return res.status(500).json({ message: "Unable to verify OTP" });
  }
};
module.exports = { sendOtp, verifyOtp };
