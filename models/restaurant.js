const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    _id: String,
    restaurant_name: String,
    hours: String,
    address: {
        address: String,
        zipcode: String,
        latitude: String,
        longitude: String
    },
    image: String,
    zomato_url: String,
    ratings: {
        aggregate_rating: String,
        votes: String
    },
    dishes:[{
        dish_id: String,
        dish_name: String,
        food: String,
        rating: String,
        restaurant_id: String,
        restaurant_name: String,
        image_url: String
    }],
    recommendations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "recommendation"
    }],
    reviews: [{
        type: String
    }]
});



const Restaurant = mongoose.model("restaurant",  restaurantSchema, "restaurant");
module.exports = Restaurant;