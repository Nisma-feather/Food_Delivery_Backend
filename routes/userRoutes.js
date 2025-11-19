const express= require('express');
const router = express.Router();
const {checkUserExist, Login, checkauth, addUserAddress, getUserById, updateAddress, deleteAddress, setChosenAddress} = require("../controllers/userController");
const { verifyToken } = require('../middlewares/authMiddleware');

router.post("/exists-user", checkUserExist)
router.post("/login",Login)
router.post("/check-auth",verifyToken,checkauth);
router.post("/add-address/:userId",addUserAddress);
router.put("/update-address/:userId/:addressId", updateAddress);
router.put("/choose-address/:userId/:addressId",setChosenAddress);
router.delete("/delete-address/:userId/:addressId",deleteAddress);

router.get("/:userId",getUserById);




module.exports = router