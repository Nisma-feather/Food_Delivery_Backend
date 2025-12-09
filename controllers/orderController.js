const Order = require("../models/Order");
const FoodItem = require("../models/FoodItem");
const User = require("../models/User");
const Cart = require("../models/Cart");

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
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    console.log("status:", status);

    const orders = await Order.find({ orderStatus: status })
      .populate("userId", "userName email")
      .populate("items.foodItemId", "name image");

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
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



const getDeliveryPartnerOrders = async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body; 
    const { status } = req.params;

    if (!deliveryPartnerId || !status) {
      return res.status(400).json({ message: "Required data missing" });
    }

    // Get all matching orders
    const orders = await Order.find({
      deliveryPartnerId: deliveryPartnerId,
      orderStatus: status.toUpperCase(), 
    }).sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Can't retrieve orders",
    });
  }
};


module.exports = { createOrder, fetchOrders, updateStatus, getOrderBasedOnStatus,getOrderById, getDeliveryPartnerOrders};
