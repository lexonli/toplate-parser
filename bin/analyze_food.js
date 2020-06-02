/*
 This script analyzes all ratings in the dishes by going through each food category and sorting the dishes,
 then populates the food collection
 */

const { useDB, getCategories } = require("./db");
const { analyze_food } = require("../analyzer/food_analyzer");

useDB((db) => {
    getCategories((categories) => {
        analyze_food(db, categories);
    })
});