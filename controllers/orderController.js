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
    const orders = await Order.find({userId});

    return res.status(200).json({orders})

    

  }
  catch(e){
    console.log(e);
    return res.status(500).json({message:"Unable to get the orders"})
  }
}

module.exports = { createOrder, fetchOrders};
