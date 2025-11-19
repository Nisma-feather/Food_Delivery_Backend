const Category = require("../models/Category");

const createCategory=async(req,res)=>{
    try{
      
       const {name} = req.body;
         console.log(name);

       const normalizedName = name.trim().toLowerCase();
       console.log(normalizedName)
      const existing = await Category.findOne({name:{$regex:`^${normalizedName}$`, $options:"i"}})
       console.log(existing)
       if(existing){
        return res.status(400).json({message:"Category already Exists"})
       }

       const newCategory =await Category.create({name})
       res.status(201).json({message:"Category Created Successfully",newCategory})
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message:"Category creation failed"})
    }
}

const updateCategory=async(req,res)=>{
  const {categoryId}=req.params;
  const {name} = req.body
  const existing = await Category.findById(categoryId);
   console.log(existing._id)
  if(!existing && existing?._id != categoryId){
     return res.status(400).json({message:"Category not found"})
  }
  const normalizedName = name.trim().toLowerCase()
 const existingName= await Category.findOne({_id:{$ne:categoryId}, name:{$regex:`^${normalizedName}$`, $options:"i"}});
 if(existingName){
  return res.status(400).json({message:"Category name already exists"})
 }
 const updateCategory = await Category.findByIdAndUpdate(categoryId,{name},{new:true});
 return res.status(200).json({message:"Category updated successfully",updateCategory})
}

const deleteCategory=async(req,res)=>{
  try{
    const {categoryId} = req.params;
    const existing = await Category.findByIdAndUpdate(categoryId);

    if(!existing){
      return res.status(400).json({message:"Category not found"})
    }

    await Category.findByIdAndDelete(categoryId);
    return res.status(200).json({message:"Category deleted successfully"})

  }
  catch(e){
    console.log(e)
    return res.status(500).json({message:"can't able delete the category"})
  }
}

const getAllCategory=async(req,res)=>{
  try{
      
    const categories = await Category.find();
    return res.status(200).json({categories})
  }
  catch(e){
    console.log(e);
    return res.status(500).json({message:"Can't able to get the category"})
  }
}


module.exports = {createCategory,updateCategory,deleteCategory,getAllCategory}