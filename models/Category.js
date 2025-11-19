const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    }
})

categorySchema.post('findOneAndDelete',async(doc)=>{
  if(doc){
    const categoryId = doc._id;

    await mongoose.model('FoodItem').updateMany({
        categories:categoryId
    },{
        $pull:{categories:categoryId}
    })
  }

})

module.exports = mongoose.model('Category',categorySchema)