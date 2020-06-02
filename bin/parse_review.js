/*
 This script crawls Zomato for reviews for every restaurant we obtain from our own database and stores those
 reviews into our database
 */

const { useDB, getRestaurants } = require("./db");
const Restaurant = require("../models/restaurant");
const ReviewParser = require("../parser/review_parser");

function startTimer(restaurant, callback) {
    //put 10 seconds between crawls
    setTimeout(parseRestaurantReviews.bind(null, restaurant, callback),10000);
}

const parseRestaurantReviews = (restaurant, callback) => {
    let parser = new ReviewParser();
    parser.parseReviews(restaurant.zomato_url, (reviews) => {
        Restaurant.updateOne({ _id: restaurant._id }, { reviews: reviews }, (err, res) => {
            if (err != null) {
                console.log(err);
            }
            callback();
        });
    });
};

const recurse_restaurants = (db, restaurants, i) => {
    startTimer(restaurants[i], () => {
        console.log("Parsed reviews of ", i+1, " restaurants");
        i += 1;
        if (i < restaurants.length) {
            recurse_restaurants(restaurants, i);
        } else {
            db.close();
        }
    });
};

useDB((db) => {
    //for each restaurant, we parse and store their reviews
    getRestaurants((restaurants) => {
        recurse_restaurants(db, restaurants, 0);
    });
});
