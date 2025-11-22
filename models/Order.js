// models/Order.js
const mongoose = require("mongoose");
const Counter = require("./Counter");

const orderItemSchema = new mongoose.Schema({
  foodItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodItem",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: Number,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],

    deliveryAddress: { type: Object, required: true },
    contactNo: { type: String, required: true },
    paymentMethod: { type: String, enum: ["COD", "ONLINE"], default: "COD" },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    orderStatus: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
    },
    timeline: {
      placedAt: { type: Date, default: Date.now },
      confirmedAt: Date,
      cancelledAt: Date,
      outForDeliveryAt: Date,
      deliveredAt: Date,
    },
    shippingCost: {
      type: Number,
    },
    packingCharge: {
      type: Number,
    },
    orderTotal: { type: Number, required: true },
    instructions: String,
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  if (this.orderNumber) return next(); // skip if already assigned

  const counter = await Counter.findOneAndUpdate(
    { name: "orderCounter" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  this.orderNumber = counter.value;
  next();
});

module.exports = mongoose.model("Order", orderSchema);
