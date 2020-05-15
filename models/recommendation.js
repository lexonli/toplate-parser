const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
    recommendation_id: String,
    description: String,
    restaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurant"
    }]
});


const Recommendation = mongoose.model("recommendation", recommendationSchema, "recommendation");
module.exports = Recommendation;
