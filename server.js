const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const categoryRoutes = require("./routes/categoryRoutes")
const foodItemRoutes = require("./routes/foodItemRoutes")
const authRoutes = require("./routes/authRoutes")
const cartRoutes = require("./routes/cartRoutes")
const userRoutes = require("./routes/userRoutes")
const orderRoutes = require("./routes/orderRoutes")
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

//Routes

app.use("/api/category",categoryRoutes)
app.use("/api/foodItem",foodItemRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/user",userRoutes)
app.use("/api/order",orderRoutes)

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("MONGODB CONNECTED SUCCESSFULLY");
    
}).catch((e)=>{
    console.log("MONGODB CONNECTION FAILED",e)
})

app.listen(process.env.PORT,()=>{
    console.log(`server running on the port ${process.env.PORT}`);
    
})
