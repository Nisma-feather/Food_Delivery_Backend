const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    foodItem:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'FoodItem',
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    totalPrice:{
       type:Number,
       required:true,
  
    },
})

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  cartItems: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Cart', cartSchema);

