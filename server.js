const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const categoryRoutes = require("./routes/categoryRoutes")
const foodItemRoutes = require("./routes/foodItemRoutes")
const authRoutes = require("./routes/authRoutes")
const cartRoutes = require("./routes/cartRoutes")
const userRoutes = require("./routes/userRoutes")
const orderRoutes = require("./routes/orderRoutes")
const favouriteRoutes = require("./routes/favouriteRoutes")
const hotelRoutes = require("./routes/hotelRoutes")
const deliveryRoutes = require("./routes/deliveryRoutes")





require('dotenv').config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

//Routes

app.use("/api/category",categoryRoutes)
app.use("/api/foodItem",foodItemRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/user",userRoutes)
app.use("/api/order",orderRoutes)
app.use("/api/favourite",favouriteRoutes)
app.use("/api/hotel",hotelRoutes)
app.use("/api/delivery", deliveryRoutes)

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("MONGODB CONNECTED SUCCESSFULLY");
    
}).catch((e)=>{
    console.log("MONGODB CONNECTION FAILED",e)
})

// Create HTTP server
const http = require('http');
const server = http.createServer(app);

// Initialize Socket.IO
const { initSocket } = require('./socket/socket');
initSocket(server);

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});