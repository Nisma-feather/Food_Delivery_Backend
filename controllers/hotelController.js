const Hotel = require("../models/Hotel");
const bcrypt = require("bcrypt");
const User = require("../models/User")
const Order = require("../models/Order");

// Controller to update hotel details
const updateRestaurant = async (req, res) => {
  try {
    const {
      email, // use email to find the hotel
      password,
      restaurantName,
      address,
      contact,
      openingTime,
      closingTime,
    } = req.body;

    const userId = "692ff6ecbd7ce8e3b48a3e2a";

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required to identify the hotel" });
    }

    // Find the hotel by email
    const hotel = await Hotel.findOne({ userId });
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Update fields if provided
    if (restaurantName) hotel.restaurantName = restaurantName;
    if (address) hotel.address = address;
    if (contact) hotel.contact = contact;
    if (openingTime) hotel.openingTime = openingTime;
    if (closingTime) hotel.closingTime = closingTime;

    // Hash the password if it is being updated
    if (password) {
      const saltRounds = 10;
      hotel.password = await bcrypt.hash(password, saltRounds);
    }

    await hotel.save();
    return res
      .status(200)
      .json({ message: "Hotel updated successfully", hotel });
  } catch (error) {
    console.error("Error updating hotel:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getRestaurantData=async(req,res)=>{
  try{
    const userId = "692ff6ecbd7ce8e3b48a3e2a";

    const restaurantData = await Hotel.findOne({userId}).select("-email -password");

    return res.status(200).json({restaurantData})

  }
  catch(e){
    console.log(e);
    return res.status(500).json({message:"can't able to get the restaurant data"})
  }

  
}

const addDeliveryPartner = async(req,res)=>{
   try {
    console.log(req.body)
    const { userName, email, password, mobile } = req.body;

    if (!userName || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const deliveryPartner = await User.create({
      userName,
      email,
      password: hashedPassword,
      mobile,
      role: "delivery",
    });

    res.status(201).json({ message: "Delivery partner created", deliveryPartner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }


}
const assignDeliveryPartner = async (req, res) => {
  try {
    const { orderId, deliveryPartnerId } = req.body;

    if (!orderId || !deliveryPartnerId) {
      return res
        .status(400)
        .json({ message: "orderId and deliveryPartnerId required" });
    }

    // 1. Check order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. Check delivery partner exists
    const partner = await User.findOne({
      _id: deliveryPartnerId,
      role: "delivery",
    });

    if (!partner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    // 3. Update order with delivery partner and status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        deliveryPartnerId,
       
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Order assigned to delivery partner",
      order: updatedOrder,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Unable to assign delivery partner" });
  }
};

const acceptOrderBydeliveryPartner=async()=>{
  try{
    const {orderId,deliveryPartnerId} = req.body;

    const isExisting = await Order.find({_id:orderId,deliveryPartnerId});
    if(!isExisting){
      return res.status(404).json({message:"The order or delivery partner not found"})
    }
    isExisting.deliveryAccepted = true
    isExisting.outForDeliveryAt = new Date();
    isExisting.orderStatus="OUT_FOR_DELIVERY"

    isExisting.save();
  }
  catch(e){
    console.log(e);
    return res.status(500).json({message:""})
  }
}

const getDeliveryPartnerOrders = async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body; // or req.user._id if using JWT
    const { status } = req.params;

    if (!deliveryPartnerId || !status) {
      return res.status(400).json({ message: "Required data missing" });
    }

    // Get all matching orders
    const orders = await Order.find({
      deliveryPartnerId: deliveryPartnerId,
      orderStatus: status.toUpperCase(), // ensure correct format
    }).sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Can't retrieve orders",
    });
  }
};

const getDeliveryPartners = async (req, res) => {
  try {
    const partners = await User.find({ role: "delivery" }).select("-password");

    return res.status(200).json({
      success: true,
      count: partners.length,
      partners,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch delivery partners",
    });
  }
};





module.exports = { updateRestaurant,getRestaurantData, addDeliveryPartner,assignDeliveryPartner, getDeliveryPartnerOrders,acceptOrderBydeliveryPartner,getDeliveryPartners};
