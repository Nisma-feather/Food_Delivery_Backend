const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One hotel per user
    },

    logo: {
      type: String,
      default: "",
    },

    restaurantName: {
      type: String,
      required: true,
    },

    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      stateName: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    contact: {
      type: String,
      default: "",
    },

    // Store only TIME (you can use string or date — both fine)
    openingTime: {
      type: Date,
      default: "",
    },

    closingTime: {
      type: Date,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
