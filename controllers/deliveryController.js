const Hotel = require("../models/Hotel");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Order = require("../models/Order");



//Adding a New Delivery Partner
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
      plainPassword:password,
    });

    res.status(201).json({ message: "Delivery partner created successfullu" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


//Fetching all the Delivery partners

const getDeliveryPartners = async (req, res) => {
  try {
    const partners = await User.find({ role: "delivery" });

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

    //  if (order.deliveryPartnerId) {
    //    return res.status(400).json({
    //      message: "Order is already assigned to a delivery partner",
    //      currentPartnerId: order.deliveryPartnerId,
    //    });
    //  }

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

//Order accepted by delivery partner

const acceptOrderByDeliveryPartner = async (req, res) => {
  try {
    const { orderId, deliveryPartnerId } = req.body;
    // const deliveryPartnerId = req.user._id; // Assuming authentication middleware

    const order = await Order.findOne({
      _id: orderId,
      deliveryPartnerId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found or not assigned to this delivery partner",
      });
    }

    // Check if already accepted
    if (order.orderStatus === "OUT_FOR_DELIVERY") {
      return res.status(400).json({
        message: "Order is already out for delivery",
      });
    }

    order.deliveryAccepted = true;
    order.outForDeliveryAt = new Date();
    order.orderStatus = "OUT_FOR_DELIVERY";

    await order.save();

    return res.status(200).json({
      message: "Order accepted and marked as out for delivery",
      order,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Unable to accept order",
    });
  }
};

const getDeliveryPartnerOrders = async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;
    const { status } = req.params;

    if (!deliveryPartnerId) {
      return res.status(400).json({ message: "deliveryPartnerId required" });
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const validStatuses = [
      "PLACED",
      "CONFIRMED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    const statusUpper = status.toUpperCase();

    if (!validStatuses.includes(statusUpper)) {
      return res.status(400).json({
        message: "Invalid status",
        validStatuses,
      });
    }

    /* ---------------- BASE QUERY ---------------- */
    let query = {
      deliveryPartnerId,
      orderStatus: statusUpper,
    };

    /* ---------------- SEARCH ---------------- */
    if (search.trim() !== "") {
      const users = await User.find({
        userName: { $regex: search, $options: "i" },
      }).select("_id");

      const userIds = users.map((u) => u._id);
      const isNumber = /^\d+$/.test(search);

      query.$or = [
        { contactNo: { $regex: search, $options: "i" } },
        { userId: { $in: userIds } },
      ];

      if (isNumber) {
        query.$or.push({ orderNumber: Number(search) });
      }
    }

    /* ---------------- SORT LOGIC ---------------- */
   let sortOption = { createdAt: 1 }; // default

   if (statusUpper === "DELIVERED") {
     sortOption = {
       "timeline.deliveredAt": -1, // primary
       createdAt: -1, // fallback
     };
   }


    /* ---------------- FETCH ---------------- */
    const orders = await Order.find(query)
      .populate("userId", "userName email")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(query);

    return res.status(200).json({
      success: true,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      count: orders.length,
      orders,
    });
  } catch (e) {
    console.error("getDeliveryPartnerOrders error:", e);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders",
    });
  }
};


const deleteDeliveryPartner = async(req,res)=>{
    try{ 
        const {userId} = req.params;
        const exists = await User.findById(userId);
       if(!exists){
        return res.status(404).json({message:"delivery partner doesnt exists"})
        }
        const  deletedUser = await User.findByIdAndDelete(userId);
        return res
          .status(200)
          .json({
            success: true,
            message: "delivery partner deleted successfully",
          });
    }
    catch(e){
        console.log(e);
        return res
          .status(500)
          .json({
            success: false,
            message: "delivery partner deleted successfully",
          });
        
    }
}

const updateDeliveryPartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { userName, email, password, mobile } = req.body;

    if (!partnerId) {
      return res.status(400).json({ message: "Partner ID is required" });
    }

    const partner = await User.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    // Check email conflict with another user
    if (email && email !== partner.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update fields
    if (userName) partner.userName = userName;
    if (email) partner.email = email;
    if (mobile) partner.mobile = mobile;

    // If password changed → hash again AND store plain password
    if (password) {
      partner.password = await bcrypt.hash(password, 10);
      partner.plainPassword = password; // WARNING: avoid in production
    }

    await partner.save();

    return res.status(200).json({
      success: true,
      message: "Delivery partner updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports={addDeliveryPartner,getDeliveryPartners,assignDeliveryPartner,acceptOrderByDeliveryPartner,getDeliveryPartnerOrders, deleteDeliveryPartner, updateDeliveryPartner }



