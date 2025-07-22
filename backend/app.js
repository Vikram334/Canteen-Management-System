require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Admin = require("./models/Admin");

const app = express();
const PORT = process.env.PORT || 8080;
const SECRET = process.env.JWT_SECRET;

// Import models
const Stud = require("./models/Student.js");
const FoodItem = require("./models/Food_items.js");
const Order = require("./models/Order.js");
const OrderItem = require("./models/OrderItem.js");

// Middleware
app.use(cors());
app.use(express.json());
//
// server.js or routes/student.js
app.post("/student/signup", async (req, res) => {
  const { student_id, password, name, ph_no, dept_name } = req.body;

  if (!student_id || !password || !name || !ph_no || !dept_name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if student already exists
    const existing = await Stud.findOne({ student_id });
    if (existing) {
      return res.status(400).json({ error: "Student already registered" });
    }

    // Save new student
    const newStudent = new Stud({ student_id, password, name, ph_no, dept_name });
    await newStudent.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Root is working");
});

// Login route (for demo purposes — no password check here)
const bcrypt = require("bcrypt");
// Admin Login
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ username, role: "admin" }, SECRET, { expiresIn: "2h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || decoded.role !== "admin") return res.status(403).json({ message: "Unauthorized" });
    next();
  });
};
// View all orders
app.get("/admin/orders", verifyAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate("student_id");
  res.json(orders);
});

// Add food item
app.post("/admin/food-items", verifyAdmin, async (req, res) => {
  try {
    const item = await FoodItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to add item" });
  }
});

// Update food item
app.put("/admin/food-items/:id", verifyAdmin, async (req, res) => {
  try {
    const updated = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// Delete food item
app.delete("/admin/food-items/:id", verifyAdmin, async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

app.post("/login", async (req, res) => {
  const { student_id, password } = req.body;

  try {
    const user = await Stud.findOne({ student_id });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ student_id: user.student_id }, SECRET, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});


// Auth middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.student_id = decoded.student_id;
    next();
  });
};

// Get profile (secured route)
app.get("/profile/:student_id", verifyToken, async (req, res) => {
  try {
    const student = await Stud.findOne({ student_id: req.params.student_id });
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update profile
app.put("/profile/:student_id", verifyToken, async (req, res) => {
  try {
    const updated = await Stud.findOneAndUpdate(
      { student_id: req.params.student_id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Profile updated successfully", student: updated });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Fetch all food items
app.get("/food-items", async (req, res) => {
  try {
    const items = await FoodItem.find({});
    res.json(items);
  } catch (err) {
    console.error("Error fetching food items:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Place order
app.post("/place-order", verifyToken, async (req, res) => {
  try {
    const { cartItems, total_price, payment_mode, order_type, pickup_time, specialInstructions } = req.body;

    // Find student from decoded token
    const student = await Stud.findOne({ student_id: req.student_id });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Create order
    const order = new Order({
      order_id: "ORD" + Date.now(),
      student_id: student._id,
      payment_mode,
      total_price,
      status: "Ordered",
      token_number: Math.floor(Math.random() * 100) + 1,
      order_type: order_type || "Dine In",
      pickup_time: pickup_time || "ASAP",
      special_instructions: specialInstructions || "",
    });
    await order.save();

    // Create each order item
    for (let item of cartItems) {
      await OrderItem.create({
        order_item_id: "ORDITEM" + Date.now() + Math.floor(Math.random() * 100),
        order_id: order._id,
        food_id: item._id,
        quantity: item.quantity,
        customization: item.customization || "",
        price_at_time: item.price?.$numberDecimal || item.price,
      });
    }

    // Send response with details for ThankYouPage
    res.status(200).json({
      message: "Order placed successfully",
      order_id: order.order_id,
      token_number: order.token_number,
      total_price: Number(order.total_price),
      pickup_time: order.pickup_time,
      payment_mode: order.payment_mode,
    });

  } catch (err) {
    console.error("❌ Order error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});
app.get("/order-history/:student_id", verifyToken, async (req, res) => {
  try {
    const student = await Stud.findOne({ student_id: req.params.student_id });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const orders = await Order.find({ student_id: student._id }).sort({ created_at: -1 });

    const orderIds = orders.map((order) => order._id);
    const orderItems = await OrderItem.find({ order_id: { $in: orderIds } }).populate("food_id");

    const history = orders.map((order) => {
      const items = orderItems
        .filter((item) => item.order_id.toString() === order._id.toString())
        .map((item) => ({
          name: item.food_id.name,
          quantity: item.quantity,
          price: item.price_at_time,
        }));

      return {
        ...order.toObject(),
        items,
      };
    });

    res.json(history);
  } catch (err) {
    console.error("❌ Error fetching order history:", err);
    res.status(500).json({ error: "Failed to fetch order history" });
  }
});

// Get order history for logged-in student
app.get("/order-history", verifyToken, async (req, res) => {
  try {
    // 🔐 Get student info from token
    const student = await Stud.findOne({ student_id: req.student_id });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // 🧾 Fetch orders by student
    const orders = await Order.find({ student_id: student._id })
      .sort({ createdAt: -1 })
      .lean();

    // 🧾 For each order, fetch items and their food details
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await OrderItem.find({ order_id: order._id })
          .populate("food_id")
          .lean();

        const orderItemsFormatted = orderItems.map(item => ({
          name: item.food_id?.name || "Unknown Item",
          image_url: item.food_id?.image_url || "",
          quantity: item.quantity,
          price: parseFloat(item.price_at_time?.toString() || 0),
        }));

        return {
          order_id: order.order_id,
          total_price: parseFloat(order.total_price?.toString() || 0),
          token_number: order.token_number,
          status: order.status,
          created_at: order.createdAt,
          items: orderItemsFormatted,
        };
      })
    );

    // ✅ Send back full enriched order history
    res.json(ordersWithItems);
  } catch (err) {
    console.error("❌ Error fetching order history:", err);
    res.status(500).json({ error: "Failed to fetch order history" });
  }
});




// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});
