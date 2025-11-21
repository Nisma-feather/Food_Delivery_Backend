const express = require('express');
const router = express.Router();
const {toggleFavourite, getUserFavourites} = require("../controllers/favouriteController")

router.post("/toggle",toggleFavourite);
router.get("/:userId", getUserFavourites)

module.exports = router;

