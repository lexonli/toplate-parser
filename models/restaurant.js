const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    zomato_id: String,
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
        _id: mongoose.Schema.Types.ObjectId,
        dish_name: String,
        food: mongoose.Schema.Types.ObjectId,
        rating: String,
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