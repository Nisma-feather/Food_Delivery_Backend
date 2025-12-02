const mongoose  = require('mongoose')
const hotelSchema = new mongoose.Schema(
  {
    
    email:{
        type:String,
        
    },
    password:{
        type:String,

    },
     logo: {
      type: String,
      default: "",
    },

    restaurantName: {
      type: String,
 
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

    openingTime: {
      type: String, 
      default: "",
    },

    closingTime: {
      type: String, 
      default: "",
    },
    role:{
        type:String,
        default:"hotel"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
