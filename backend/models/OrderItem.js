const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    order_item_id: {
        type: String,
        required: true,
        unique: true
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    food_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodItem",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    customization: {
        type: String
    },
    price_at_time: {
        type: mongoose.Types.Decimal128,
        required: true
    }
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem;
