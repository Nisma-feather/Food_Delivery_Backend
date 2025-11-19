const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findOneAndUpdate } = require("../models/Counter");

// ✅ Check if user exists (register helper)
const checkUserExist = async (req, res) => {
  try {
    console.log("Checking if user exists...");
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "Email already exists" }); // 409 Conflict
    }

    return res.status(200).json({ message: "Email is available" });
  } catch (error) {
    console.error("Error checking user existence:", error);
    return res
      .status(500)
      .json({ message: "Server error while checking email" });
  }
};

// ✅ Login Controller
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if user exists
    const existing = await User.findOne({ email });
    if (!existing) {
      return res.status(404).json({
        message: "No account found. Please register to continue.",
      });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, existing.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign(
      { id: existing._id, role: existing.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4️⃣ Respond with user details + token
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: existing._id,
        role: existing.role,
        email: existing.email,
        name: existing.userName || existing.name,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

//verifyin the profile

const checkauth = async(req,res) =>{
  try{
    
    if(req?.user){
       return res.status(200).json({userId:req.user?.id,role:req.user?.role})
    }
    else{
      return res.status(404)
    }
  }
  catch(e){
    console.log(e)
    return res.status(500).json({message:"Can't able to complete the authentication"})
  }
}
//Adding UserAddress
const  addUserAddress=async(req,res)=>{
  try{
    const {userId} = req.params;
    const userExists = await User.findById(userId);
    if(!userExists){
       return res.status(404).json({message:"User not found"})
    }
    const updatedUser = await User.findByIdAndUpdate(userId,{$push:{address:req.body}},{new:true});
    return res
      .status(200)
      .json({ message: "user address added  successfully", updatedUser });

  }
  catch(e){
    console.log(e)
    return res.status(500).json({message:"Can't able to add the user Address"})
  }
}
  const getUserById = async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(userId)
      const user = await User.findById(userId).select("userName address mobile");
      if (!user) {
        return res.status(404).json({message:"user not found"});
      }
      return res.status(200).json({user})
    } catch (e) {
      console.log(e);
      return res.status(500).json({message:"cant able to get the users"})
    }
  }; 
 
  const updateAddress=async(req,res)=>{
    try{
    
      const {userId,addressId} = req.params;


      console.log(addressId)

      const userAddress = await User.findOne({_id:userId,"address._id":addressId});
      if(!userAddress){
        return res.status(404).json({message:"User not found"})
      }
     const updatedUser = await User.findOneAndUpdate(
       { _id: userId, "address._id": addressId },
       {
         $set: {
           "address.$.fullAddress": req.body.fullAddress,
           "address.$.city": req.body.city,
           "address.$.state": req.body.state,
           "address.$.pincode": req.body.pincode,
           "address.$.country": req.body.country,
         },
       },
       { new: true }
     );
      return res.status(200).json({message:"Address updated successfully",updatedUser})


    }
    catch(e){
      console.log(e)
    }
  }

const deleteAddress = async (req, res) => {
  try {
    const { userId,addressId} = req.params;
// address id

    const updated = await User.findByIdAndUpdate(
      userId,
      { $pull: { address: { _id: addressId} } },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "User or address not found" });

    return res.status(200).json({
      message: "Address deleted successfully",
      updatedUser: updated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Error deleting address" });
  }
};

const setChosenAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { addressId } = req.params;

    // Remove chosen from all other addresses
    await User.updateOne(
      { _id: userId },
      { $set: { "address.$[].chosen": false } }
    );

    // Set chosen true for the selected one
    await User.updateOne(
      { _id: userId, "address._id": addressId },
      { $set: { "address.$.chosen": true } }
    );

    return res.status(200).json({ message: "Address selected successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Failed to set chosen address" });
  }
};

  module.exports = { checkUserExist, Login,checkauth,addUserAddress,getUserById,updateAddress,deleteAddress,setChosenAddress};
