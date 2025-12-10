const express = require("express");
const router = express.Router();
const {
  addDeliveryPartner,
  getDeliveryPartners,
  assignDeliveryPartner,
  acceptOrderByDeliveryPartner,
  getDeliveryPartnerOrders,
  deleteDeliveryPartner,
  updateDeliveryPartner,
} = require("../controllers/deliveryController");

router.post("/partner", addDeliveryPartner);
router.get("/partners", getDeliveryPartners);
router.post("/assign", assignDeliveryPartner);
router.post("/accept-order", acceptOrderByDeliveryPartner);
router.post("/my-orders/:status", getDeliveryPartnerOrders);
router.delete("/:userId",deleteDeliveryPartner);
router.put("/partner/:partnerId",updateDeliveryPartner)

module.exports = router
