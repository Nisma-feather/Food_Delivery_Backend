const express= require('express');
const router = express.Router();

const {addToCart,getCartItems,removeItems, checkUserCartItem, getSelectedItems} = require("../controllers/cartController");

router.post("/",addToCart);
router.get("/:userId",getCartItems);
router.delete("/removeItem/:FoodId", removeItems);
router.post("/check-item/:userId",checkUserCartItem);
router.post("/get-items/:userId", getSelectedItems);





module.exports= router