const express = require('express');
const router = express.Router();
const {updateRestaurant, getRestaurantData} = require("../controllers/hotelController")

router.put("/profile",updateRestaurant);
router.get("/",getRestaurantData);


module.exports = router;