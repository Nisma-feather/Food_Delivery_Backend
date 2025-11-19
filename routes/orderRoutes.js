const express = require('express');
const router = express.Router();
const {createOrder} = require("../controllers/orderController");

router.post("/:userId", createOrder)


// const createUserorder=async(req,res)=>{
//     try{
//      const {userId} = req.params;
//      const existingUser = await User.findById(userId);
//      if(!existingUser){
//         return res.status(404).json({message:"User not found"})
//      }

//      const newOrder = await Order.create(req.body);
//      return res.status(200).json({message:"new order created successfuly"})
//     }
//     catch(e){
//         console.log(e);
//     return res.status(500).json({message:"cant able create the order"})
//     }
// }

module.exports = router;