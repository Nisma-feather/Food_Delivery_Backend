const Hotel = require("../models/Hotel");
const bcrypt = require("bcrypt");

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




module.exports = { updateRestaurant,getRestaurantData };
