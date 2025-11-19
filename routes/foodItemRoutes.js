const express = require('express');
const { createFoodItem, getFoodItem, updateFoodItem, deleteFoodItem, getFoodItemById } = require('../controllers/FoodItemController');
const router = express.Router();

router.post("/",createFoodItem);
router.get("/",getFoodItem);
router.get("/:foodItemId", getFoodItemById)
router.put("/:foodItemId", updateFoodItem);
router.delete("/:foodItemId",deleteFoodItem);

module.exports = router;