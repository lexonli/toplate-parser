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
    ratings: {
        aggregate_rating: String,
        votes: String
    },
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