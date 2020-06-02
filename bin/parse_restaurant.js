/*
 This script calls the zomato search api and populates our own database with restaurants
 */

const { useDB } = require("./db");
const RestaurantParser = require("../parser/restaurant_parser");

useDB((db) => {
    const restaurantParser = new RestaurantParser();
    restaurantParser.parse(db);
});