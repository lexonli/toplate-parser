const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    food_name: String,
    food_dishes: [{
        type: mongoose.Schema.Types.String
    }],
    dishes: [{
        dish_id: mongoose.Schema.Types.ObjectId,
        dish_name: String,
        food: String,
        rating: Number,
        restaurant_id: mongoose.Schema.Types.ObjectId,
        restaurant_name: String,
        image_url: String
    }]
});


const Category = mongoose.model("category", categorySchema, "category");
module.exports = Category;