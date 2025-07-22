const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./Admin"); // Adjust path if needed

const MONGO_URL = "mongodb://127.0.0.1:27017/canteen"; // or from .env

mongoose.connect(MONGO_URL)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Optional: clear existing admins
    await Admin.deleteMany({});
    console.log("🚮 Old admins cleared");

    const hashedPassword = await bcrypt.hash("gagan123", 10); // Plaintext: admin123

    const admin = new Admin({
      username: "gagan",          // Login: admin
      password: hashedPassword,   // Hashed
    });

    await admin.save();
    

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
  });
