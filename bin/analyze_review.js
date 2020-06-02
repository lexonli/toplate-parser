/*
 This script takes all dishes from the categories collection and looks for these dishes in every restaurant's reviews
 Then, all these dishes are rated using how positive/negative each mentioning review is
 Finally, we take this information and populate the Restaurant, Category and Dish collection
 (Note: Denormalization is done here to make retrieving more efficient)
 */

const { useDB, getCategories, getRestaurants } = require("./db");
const ReviewAnalyzer = require("../analyzer/review_analyzer");

useDB( (db) => {
    getCategories((categories) => {
        getRestaurants((restaurants) => {
            const reviewAnalyzer = new ReviewAnalyzer(restaurants, categories);
            reviewAnalyzer.analyze(db);
        });
    });
});
