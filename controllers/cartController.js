const Cart = require("../models/Cart");
const FoodItem = require("../models/FoodItem");
const { updateFoodItem } = require("./FoodItemController");
const mongoose = require("mongoose")



const addToCart = async (req, res) => {
  try {
    const { userId, FoodId, quantity } = req.body;

    if (!userId || !FoodId || !quantity) {
      return res.status(400).json({ message: "Missing required details" });
    }

    // Step 1: Check food item exists
    const foodItem = await FoodItem.findById(FoodId);
    if (!foodItem) {
      return res.status(404).json({ message: "Food Item not found" });
    }

    const price = foodItem.price;
    const itemIncrement = price * quantity;

    // Step 2: Try updating existing cart item
    let cart = await Cart.findOneAndUpdate(
      { userId, "cartItems.foodItem": FoodId },
      {
        $inc: {
          "cartItems.$.quantity": quantity,
          "cartItems.$.totalPrice": itemIncrement,
          totalPrice: itemIncrement,
        },
      },
      { new: true }
    );

   
    // Step 3: If item doesn’t exist, push it into the array
    if (!cart) {
      cart = await Cart.findOneAndUpdate(
        { userId },
        {
          $push: {
            cartItems: {
              foodItem: FoodId,
              quantity,
              totalPrice: itemIncrement,
            },
          },
          $inc: { totalPrice: itemIncrement },
        },
        { new: true, upsert: true }
      );
    }

    const updatedItem = cart.cartItems.find(item => item.foodItem.toString() === FoodId);


    // Step 4: Send updated cart back to frontend
    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cart,
      updatedItem


    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res
      .status(500)
      .json({ message: "Can't add item to the cart", error: error.message });
  }
};

const getCartItems=async(req,res)=>{
    try{
      const {userId} = req.params;
      const Items = await Cart.findOne({ userId }).populate(
        "cartItems.foodItem", "name price"
      );
      return res.status(200).json({Items})
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message:"Cart tem Fetch Failed"})
    }
}

const removeItems = async (req, res) => {
  try {
    const { FoodId } = req.params;
    const { userId } = req.body;

    const foodObjectId = new mongoose.Types.ObjectId(FoodId);

    // 1️⃣ Check food exists
    const foodExists = await FoodItem.findById(foodObjectId);
    if (!foodExists) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // 2️⃣ Find cart with matching ObjectId
    const cart = await Cart.findOne({
      userId,
      "cartItems.foodItem": foodObjectId,
    });

    if (!cart) {
      return res.status(404).json({ message: "Food item not found in cart" });
    }

    // 3️⃣ Get that item
    const item = cart.cartItems.find((i) => i.foodItem.toString() === FoodId);

    const itemTotalPrice = item.totalPrice;

    // 4️⃣ Remove item
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      {
        $pull: { cartItems: { foodItem: foodObjectId } },
        $inc: { totalPrice: -itemTotalPrice },
      },
      { new: true }
    ).populate("cartItems.foodItem");

    // 5️⃣ Reset total price if cart empty
    if (updatedCart.cartItems.length === 0) {
      updatedCart.totalPrice = 0;
      await updatedCart.save();
    }

    return res.status(200).json({
      message: "Item removed successfully",
      updatedCart,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Can't remove item from cart" });
  }
};


const checkUserCartItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { foodId } = req.body;

    //  Check if the food exists
    const existing = await FoodItem.findById(foodId);
    if (!existing) {
      return res.status(404).json({ message: "Food not found" });
    }

    // Find user's cart and match item
    const cartData = await Cart.findOne(
      { userId, "cartItems.foodItem": foodId },
      { cartItems: { $elemMatch: { foodItem: foodId } } }
    );

    // If found, extract the specific item
    if (cartData && cartData.cartItems.length > 0) {
      const item = cartData.cartItems[0];
      return res.status(200).json({
        exists: true,
        quantity: item.quantity,
        price: item.totalPrice,
      });
    }

    // If not found
    return res.status(200).json({ exists: false });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: "Can't check cart item" });
  }
};

const getSelectedItems = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(req.body)
    const { selectedItems } = req.body;

    if (!selectedItems || selectedItems.length === 0) {
      return res.status(400).json({ message: "No item IDs provided" });
    }

    // 1. Fetch the full cart (correct condition: userId)
    const userCart = await Cart.findOne({ userId })
      .populate("cartItems.foodItem", "name image price")
      .lean();

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // 2. Filter only selected cart items
    const checkoutItems = userCart.cartItems.filter((item) =>
      selectedItems.includes(item.foodItem._id.toString())
    );

    return res.status(200).json({
      success: true,
      checkoutItems,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Can't get selected items from the cart",
    });
  }
};





module.exports = { addToCart,getCartItems,removeItems,checkUserCartItem,getSelectedItems};
