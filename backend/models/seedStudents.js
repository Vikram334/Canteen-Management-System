// seedStudents.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/canteen", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define schema and model
const studentSchema = new mongoose.Schema({
  student_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  ph_no: { type: Number, required: true },
  Loyalty_points: { type: Number, default: 0 },
  dept_name: { type: String, required: true },
  password: { type: String, required: true },
  created_At: { type: Date, default: Date.now },
});

const Student = mongoose.model("Student", studentSchema);

// Function to hash passwords and insert data
const seedStudents = async () => {
  try {
    // Optional: Clear existing data
    await Student.deleteMany({}); 
    console.log("🗑️ Cleared existing students");

    const rawStudents = [
      {
        student_id: 102,
        name: "Ankur Kumar Chowdhary",
        ph_no: 9876543210,
        Loyalty_points: 20,
        dept_name: "Mechanical",
        password: "ankur123",
      },
      {
        student_id: 103,
        name: "Md Qamar Hussain",
        ph_no: 8765432109,
        Loyalty_points: 35,
        dept_name: "Electrical",
        password: "qamar123",
      },
      {
        student_id: 104,
        name: "Faizan Talib Khan",
        ph_no: 7654321098,
        Loyalty_points: 50,
        dept_name: "Civil",
        password: "faizan123",
      },
      {
        student_id: 105,
        name: "Vikram Rajak",
        ph_no: 6543210987,
        Loyalty_points: 15,
        dept_name: "Computer Science",
        password: "vikram123",
      },
    ];

    // Hash passwords
    const hashedStudents = await Promise.all(
      rawStudents.map(async (student) => ({
        ...student,
        password: await bcrypt.hash(student.password, 10),
      }))
    );

    // Insert students
    await Student.insertMany(hashedStudents);
    console.log("🎉 Students inserted successfully!");

  } catch (err) {
    console.error("❌ Error inserting students:", err);
  } finally {
    mongoose.disconnect();
  }
};

seedStudents();
