const mongoose = require("mongoose");

const top20dishesSchema = new mongoose.Schema({
    dish_id: String,
    dish_name: String,
    rating: Number,
    restaurant_id: String,
    restaurant_name: String,
    image_url: String
});

const foodSchema = new mongoose.Schema({
    food_id: String,
    food_name: String,
    top_20_dishes: [top20dishesSchema]
});


const Food = mongoose.model("food", foodSchema, "food");

module.exports = Food;