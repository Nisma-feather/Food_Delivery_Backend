const express= require('express');
const router = express.Router();

const {sendOtp,verifyOtp,sendForgotOtp,verifyForgotOtp,resetPassword} = require("../controllers/otpController");

router.post("/send-otp",sendOtp);
router.post("/verify-otp",verifyOtp);
router.post("/forgot/send-otp", sendForgotOtp);
router.post("/forgot/verify-otp", verifyForgotOtp);
router.post("/forgot/reset-password", resetPassword);


module.exports= router