const mongoose = require("mongoose");

const top20dishesSchema = new mongoose.Schema({
    dish_id: String,
    dish_name: String,
    rating: Number,
    restaurant_id: String,
    restaurant_name: String,
    image_url: String
});

const articleSchema = new mongoose.Schema({
    id: String,
    // TODO: If we need to 'find()' document by ObjectId, then the type in schema need to be ObjectID type,
    //  so I change the schema type for food_id, but not sure if there is simpler way to achieve this result
    food_id: mongoose.Types.ObjectId,
    article_title: String,
    description: String,
    image: String,
    top_20_dishes: [top20dishesSchema]
});

const article = mongoose.model("article", articleSchema, "article");
module.exports = article;
