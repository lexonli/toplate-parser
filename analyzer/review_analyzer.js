//receives an array of reviews and reviews
require('../models');

console.log("review_analyzer initialized");

exports.getCategories = () => {
    try {
        Category
            .find({})
            .exec(function (err, categories) {
                console.log(categories)
            });
    } catch (err) {
        console.log("Database query failed");
    }
};