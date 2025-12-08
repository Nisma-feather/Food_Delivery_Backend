const express = require('express');
const router = express.Router();
const {updateRestaurant, getRestaurantData, addDeliveryPartner, assignDeliveryPartner, acceptOrderBydeliveryPartner, getDeliveryPartnerOrders, getDeliveryPartners} = require("../controllers/hotelController")

router.put("/profile",updateRestaurant);
router.get("/",getRestaurantData);
router.post("/create-delivery-partner",addDeliveryPartner);
router.post("/assign-delivery",assignDeliveryPartner);
router.post("/accept-order",acceptOrderBydeliveryPartner);
router.post("/delivery-partner-orders",getDeliveryPartnerOrders);
router.get("/delivery-partner",getDeliveryPartners);



module.exports = router;