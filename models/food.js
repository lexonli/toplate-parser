const mongoose = require("mongoose");

const top20dishesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dish_name: String,
    rating: Number,
    restaurant_id: mongoose.Schema.Types.ObjectId,
    restaurant_name: String,
    image_url: String
});

const foodSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    food_name: String,
    top_20_dishes: [top20dishesSchema]
});


const Food = mongoose.model("food", foodSchema, "food");

module.exports = Food;