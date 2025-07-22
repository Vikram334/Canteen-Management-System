const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
    food_id: {
        type: String,
        required: true,
        unique: true // Ensures it's a primary key
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String // Text can be represented by String in MongoDB
    },
    price: {
        type: mongoose.Types.Decimal128, // or Number, depending on precision needs
        required: true
    },
    image_url: {
        type: String
    },
    available_qty: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        enum: ["Snacks", "Meals", "Beverages", "Desserts", "Other"], // Optional: restrict values
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews_count: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const FoodItem = mongoose.model("FoodItem", foodItemSchema);

module.exports = FoodItem;
