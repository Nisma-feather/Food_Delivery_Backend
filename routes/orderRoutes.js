const express = require('express');
const router = express.Router();
const {createOrder, fetchOrders, updateStatus, getOrderBasedOnStatus, getOrderById, updatePaymentStatus, updateReadStatus} = require("../controllers/orderController");
const { verifyToken } = require('../middlewares/authMiddleware');


router.post("/update/update-status",updateStatus);
router.get("/based-status",getOrderBasedOnStatus);
router.get("/getById/:orderId",getOrderById);
router.put("/payment-status/:orderId",updatePaymentStatus)
router.post("/:userId", createOrder);
router.get("/:userId", fetchOrders);
router.patch("/read-status/:orderId", updateReadStatus);


module.exports = router;