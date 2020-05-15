const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    restaurant_id: String,
    restaurant_name: String,
    hours: String,
    distance: String,
    image: String,
    dishes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "dish"
    }],
    recommendations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "recommendation"
    }]
});



const Restaurant = mongoose.model("restaurant",  restaurantSchema, "restaurant");
module.exports = Restaurant;