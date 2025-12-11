const Order = require("../models/Order");
const FoodItem = require("../models/FoodItem");
const User = require("../models/User");
const Cart = require("../models/Cart");
const {io,connectedUsers} = require("../socket/socket")

const createOrder = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      deliveryAddress,
      checkoutItems,
      totalAmount,
      contactNo,
      paymentMethod,
      instructions,
    } = req.body;

    // Validate User
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Shipping & Packing Cost
    const shippingCost = 40;
    const packingCharge = 10;
    let orderAmount = 0;

    // Build Order Items list
    const items = await Promise.all(
      checkoutItems.map(async (item) => {
        const food = await FoodItem.findById(item.foodItem._id).select(
          "price name"
        );
        if (!food) {
          throw new Error(`Food item not found: ${item.foodItem._id}`);
        }

        const totalPrice = item.quantity * food.price;
        orderAmount += totalPrice;

        return {
          foodItemId: food._id,
          quantity: item.quantity,
          price: food.price,
          totalPrice,
        };
      })
    );

    // Auto-calculated final total
    const orderTotal = orderAmount + shippingCost + packingCharge;

    // Create the order
    const order = new Order({
      userId,
      items,
      deliveryAddress,
      contactNo,
      paymentMethod: paymentMethod || "COD",
      shippingCost,
      packingCharge,
      orderTotal,
      instructions: instructions || "",
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
      timeline: {
        placedAt: new Date(), // auto timestamp
      },
    });

    // This will trigger orderNumber auto-increment via pre-save hook
    await order.save();

    const restaurantId = "692ff6ecbd7ce8e3b48a3e2a";
     const socketId = connectedUsers.restaurant[restaurantId];

     if (socketId) {
       io.to(socketId).emit("new-order", order);
     }
    const foodIds = checkoutItems.map((item) => item.foodItem._id);

    await Cart.updateOne(
      { userId },
      {
        $pull: {
          cartItems: { foodItem: { $in: foodIds } },
        },
      }
    );

    
    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log("Order Error:", error);
    return res
      .status(500)
      .json({ message: "Cannot place order", error: error.message });
  }
};

const fetchOrders = async(req,res)=>{
  try{
    const {userId} = req.params;
    const userExists = await User.findById(userId);
    if(!userExists){
      return res.status(404).json({mesage:"User not found"})
    }
    const orders = await Order.find({ userId }).populate("items.foodItemId","name");

    return res.status(200).json({orders})

  }
  catch(e){
    console.log(e);
    return res.status(500).json({message:"Unable to get the orders"})
  }
}

const updateStatus=async(req,res)=>{
  try{

    console.log("token verified")
   
    const {status,orderId} = req.body;
    
    const order = await Order.findById(orderId);
    if(!order){
      return res.status(200).json({message:"orderot found"})
    }
    order.orderStatus = status;
    

    switch (status) {
      case "PLACED":
        order.timeline.placedAt = new Date();
        break;
      case "CONFIRMED":
        order.timeline.confirmedAt = new Date();
        break;
      case "OUT_FOR_DELIVERY":
        order.timeline.outForDeliveryAt = new Date();
        break;
      case "DELIEVERED":
        order.timeline.deliveredAt = new Date();
        break;

       case "CANCELLED" : 
        order.timeline.cancelledAt = new Date();
        break;
    }

    order.save();
    return res.status(200).json({message:`order status updated to ${status}`})

  }
  catch(e){
    console.log(e);
    res.status(500).json({message:"server Error"})
  }
}

const getOrderBasedOnStatus = async (req, res) => {
  try {
    let { status, page = 1, limit = 10, search = "" } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const skip = (page - 1) * limit;

    let query = {
      orderStatus: status,
    };

    // SEARCH FILTER
    if (search.trim() !== "") {
      const isNumber = /^\d+$/.test(search);

      query.$or = [
        { contactNo: { $regex: search, $options: "i" } },
        { "deliveryAddress.fullAddress": { $regex: search, $options: "i" } },
        { "deliveryAddress.city": { $regex: search, $options: "i" } },
      ];

      // only add orderNumber if numeric
      if (isNumber) {
        query.$or.push({ orderNumber: Number(search) });
      }
    }

    // FETCH ORDERS
    const orders = await Order.find(query)
      .populate("userId", "userName email")
      .populate("items.foodItemId", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const documentCount = await Order.countDocuments(query);

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
      currentPage: page,
      totalPages: Math.ceil(documentCount / limit),
      totalItems: documentCount,
    });
  } catch (e) {
    console.error("Error in getOrderBasedOnStatus:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getOrderById=async(req,res)=>{
  try{
    const {orderId} = req.params;

    const order = await Order.findById(orderId)
      .populate("userId", "userName email")
      .populate("items.foodItemId", "name image")
      .populate("deliveryPartnerId","userName mobile");
    
      if(!order){
        return res.status(404).json({message:"Order not found"})
      }

      return res.status(200).json({order})


  }
  catch(e){
    console.log(e);
    return res.status(500).json({message:"failed to getthe order"})
  }
}


const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    // Check if orderId was sent
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // Find order
    const orderExists = await Order.findById(orderId);
    if (!orderExists) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update payment status and return updated document
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true } // returns updated document
    );

    return res.status(200).json({
      message: "Payment status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res.status(500).json({
      message: "Server error while updating payment status",
    });
  }
};





module.exports = { createOrder, fetchOrders, updateStatus, getOrderBasedOnStatus,getOrderById,  updatePaymentStatus};
