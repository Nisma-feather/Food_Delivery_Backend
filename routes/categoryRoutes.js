const express= require('express');
const router = express.Router();
const {createCategory, updateCategory, deleteCategory, getAllCategory} = require("../controllers/categoryController")

router.post("/",createCategory);
router.put("/:categoryId", updateCategory);
router.delete("/:categoryId",deleteCategory);
router.get("/",getAllCategory);

module.exports= router