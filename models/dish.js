const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dish_name: String,
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food"
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurant"
    },
    rating: Number,
    image_url: String
});


const Dish = mongoose.model("dish", dishSchema, "dish");
module.exports = Dish;