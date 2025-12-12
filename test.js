const mongoose = require("mongoose");
const Hotel = require("./models/Hotel");
require("dotenv").config();
const Order = require("./models/Order")

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log(e));

// ⬇️ Function to insert hotel profile with userId + restaurantName
const updateReadFields = async () => {
  try {
    console.log("Updating orders...");

    // 1. Add fields to all orders if missing
    await Order.updateMany(
      { readByRestaurant: { $exists: false } },
      { $set: { readByRestaurant: false } }
    );

    await Order.updateMany(
      { readByDeliveryPartner: { $exists: false } },
      { $set: { readByDeliveryPartner: false } }
    );

    // 2. Apply logic based on status

    // CASE 1: PLACED → both false
    await Order.updateMany(
      { orderStatus: "PLACED" },
      {
        $set: {
          readByRestaurant: false,
          readByDeliveryPartner: false,
        },
      }
    );

    // CASE 2: CONFIRMED → restaurant:true, delivery:false
    await Order.updateMany(
      { orderStatus: "CONFIRMED" },
      {
        $set: {
          readByRestaurant: true,
          readByDeliveryPartner: false,
        },
      }
    );

    // CASE 3: OUT_FOR_DELIVERY & DELIVERED → both true
    await Order.updateMany(
      { orderStatus: { $in: ["OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"] } },
      {
        $set: {
          readByRestaurant: true,
          readByDeliveryPartner: true,
        },
      }
    );

    console.log("Order fields updated successfully!");
    process.exit();
  } catch (err) {
    console.error("Error updating:", err);
    process.exit(1);
  }
};

updateReadFields();