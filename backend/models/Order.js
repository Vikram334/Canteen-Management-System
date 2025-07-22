const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudData", // Assuming your student model is named StudData
        required: true
    },
    payment_mode: {
        type: String,
        enum: ["Online", "Cash","UPI"],
        required: true
    },
    total_price: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    status: {
        type: String,
        enum: ["Ordered", "Preparing", "Ready", "Paid"],
        default: "Ordered"
    },
    token_number: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
