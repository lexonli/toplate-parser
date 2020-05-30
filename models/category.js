const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    _id: String,
    food_name: String,
    food_dishes: [{
        type: mongoose.Schema.Types.String
    }],
});


const Category = mongoose.model("category", categorySchema, "category");
module.exports = Category;