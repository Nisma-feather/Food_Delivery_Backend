const mongoose = require("mongoose");
const Hotel = require("./models/Hotel");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log(e));

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Hotel.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    // Create new admin
    const admin = new Hotel({
      email: "admin@gmail.com",
      password: "admin@123",
      
    });

    await admin.save(); // triggers pre-save hook for hashing password
    console.log("✅ Admin created successfully");
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
