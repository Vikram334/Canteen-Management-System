// models/Student.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const studentschema = new mongoose.Schema({
  student_id: { type: Number, required: true, unique: true},
  name: { type: String, required: true },
  ph_no: { type: Number, required: true },
  Loyalty_points: { type: Number },
  dept_name: { type: String, required: true },
  
  password: { type: String, required: true }, // Hashed password
  created_At: { type: Date, default: Date.now },
});

// Hash password before saving
studentschema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("Student", studentschema);