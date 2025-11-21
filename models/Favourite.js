const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    favouriteItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"FoodItem"
    }]
})

module.exports = mongoose.model('Favourite', favouriteSchema);