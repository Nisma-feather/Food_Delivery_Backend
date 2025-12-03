const mongoose = require("mongoose");
const Hotel = require("./models/Hotel");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log(e));

// ⬇️ Function to insert hotel profile with userId + restaurantName
const createHotelProfile = async () => {
  try {
    const userId = "692ff6ecbd7ce8e3b48a3e2a";
    const restaurantName = "My Restaurant"; 

    // check if hotel already exists for this user
    const existingHotel = await Hotel.findOne({ userId });

    if (existingHotel) {
      console.log("Hotel profile already exists for this user");
      return;
    }

    const newHotel = new Hotel({
      userId, // store userId
      restaurantName, // store restaurant name
      email: "", // optional
      password: "", // no admin required
      contact: "",
      logo: "",
      address: {
        street: "",
        city: "",
        stateName: "",
        pincode: "",
      },
      openingTime: null,
      closingTime: null,
      role: "hotel",
    });

    await newHotel.save();
    console.log("✅ Hotel profile created successfully");
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};

createHotelProfile();
