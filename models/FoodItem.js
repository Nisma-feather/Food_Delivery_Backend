const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  price:{
    type:Number,
    required:true,
  },
  description:{
    type:String,
    required:true,
  },
  image:String,
  categories:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category",
  }],
  isAvailable:{
    type:Boolean,
    default:true
  }
},{timestamps:true})

module.exports = mongoose.model("FoodItem",FoodItemSchema)

