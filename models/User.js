const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    fullAddress: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    chosen:{ type:Boolean, default:false}
  },
  { _id: true }
);



const userSchema = new mongoose.Schema({
    email:{
      type:String,
      unique:true,
    },
    mobile:{
        type:String,
    },
    userName:{
        type:String,
    
    },
    password:{
        type:String,
        
    },
    address:[addressSchema],
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    signupType:{
      type:"String",
      enum:["mail","google","phone"]
    },
    role:{
      type:String,
      enum:["user","hotel"],
      default:'user'
    },

},{timestamps:true});






module.exports = mongoose.model('User',userSchema)