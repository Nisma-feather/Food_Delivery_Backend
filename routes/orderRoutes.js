const express = require('express');
const router = express.Router();
const {createOrder, fetchOrders, updateStatus, getOrderBasedOnStatus, getOrderById} = require("../controllers/orderController");
const { verifyToken } = require('../middlewares/authMiddleware');


router.post("/update/update-status",updateStatus);
router.get("/based-status",getOrderBasedOnStatus);
router.get("/getById/:orderId",getOrderById);
router.post("/:userId", createOrder);
router.get("/:userId", fetchOrders);

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