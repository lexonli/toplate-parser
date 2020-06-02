require("../config");
const Restaurant = require("../models/restaurant");
const mongoose = require("mongoose");
const ReviewParser = require("../parser/review_parser");

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName: DB_NAME
});

const db = mongoose.connection;
db.on("error", err => {
    console.error(err);
    process.exit(1);
});

const getRestaurants = (callback) => {
    try {
        Restaurant
            .find({})
            .exec(function (err, restaurants) {
                callback(restaurants)
            });
    } catch (err) {
        console.log(err);
        console.log("Database query failed");
    }
};

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

const recurse_restaurants = (restaurants, i) => {
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

db.once("open", async () => {
    //for each restaurant, we parse and store their reviews
    getRestaurants((restaurants) => {
        recurse_restaurants(restaurants, 0);
    });
});
