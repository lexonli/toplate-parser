const mongoose = require("mongoose");

//TODO: Modify dishSchema (currently unused)
const dishSchema = new mongoose.Schema({
    dish_id: String,
    dish_name: String,
    food: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "food"
    }],
    restaurant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurant"
    }],
    rating: Number,
    image: String
});


const Dish = mongoose.model("dish", dishSchema, "dish");
module.exports = Dish;