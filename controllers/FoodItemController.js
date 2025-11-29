const FoodItem = require("../models/FoodItem");


const createFoodItem = async(req,res)=>{
    try{
       const newFoodItem = await FoodItem.create(req.body);
       return res.status(201).json({message:"Food Item Created Successfuly",newFoodItem})
    }
    catch(e){
        console.log(e)
        return res.status(500).json({message:"can't able to create the food Item"})
    }
}

const getFoodItem = async(req,res)=>{
    try{
     const {search,category} = req.query;
     console.log(search,category)
     const query={};
     if(category){
       query.categories = category;
     }
     if(search){
        query.name = { $regex:search,$options:"i" };
     }
    
     const foodItems = await FoodItem.find(query).populate("categories","name")
     return res.status(200).json({foodItems})
    }
    catch(e){
        console.log(e)
    }
}

const updateFoodItem=async(req,res)=>{
    try{ 
    const {foodItemId} = req.params;
    const existing = await FoodItem.findById(foodItemId);
    if(!existing){
        return res.status(404).json({message:"Food Item not found"})
    }
    
    const updatedCategory = await FoodItem.findByIdAndUpdate(foodItemId,req.body,{new:true});
    return res.status(200).json({updatedCategory})
    

    }
    catch(e){
        console.log(e) 
        return res.status(500).json({message:"can't able to update the category"})
    }
}

const deleteFoodItem = async(req,res)=>{
    try{
      const {foodItemId} = req.params;
     const existing = await FoodItem.findById(foodItemId);
     if (!existing) {
       return res.status(404).json({ message: "Food Item not found" });
     }
     await FoodItem.findByIdAndDelete(foodItemId)
     return res.status(200).json({message:"Food Item deleted successfully"})
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message:"Can't able to delete the Food Item"})
    }
}

const getFoodItemById=async(req,res)=>{
    try{
      const {foodItemId} = req.params;
      if(!foodItemId){
        return res.status(400).json({message:"Missing the required field"})
      }
    const foodItem = await FoodItem.findById(foodItemId);
    if(!foodItem){
        return res.status(404).json({message:"Food item not found"})
    }

    return res.status(200).json({foodItem});

    }
    catch(e){
        console.log(e)
        return res.status(500).json({message:"Food Item fetched failed"})
    }
}

module.exports={createFoodItem,getFoodItem,updateFoodItem,deleteFoodItem, getFoodItemById}