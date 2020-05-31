require("../config");
const Category = require("../models/category");
const Restaurant = require("../models/restaurant");
const mongoose = require("mongoose");
const RestaurantParser = require("../parser/restaurant_parser");
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

const getCategories = (callback) => {
    try {
        Category
            .find({})
            .exec(function (err, categories) {
                callback(categories)
            });
    } catch (err) {
        console.log(err);
        console.log("Database query failed");
    }
};

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
    setTimeout(stopTimer.bind(null, restaurant, callback),30000);
}

const stopTimer = (restaurant, callback) => {
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
        console.log("Parsed reviews of ", i, " restaurants");
        i += 1;
        if (i < restaurants.length) {
            recurse_restaurants(restaurants, i);
        }
    });
};

db.once("open", async () => {
    // const restaurantParser = new RestaurantParser();
    // restaurantParser.parse(db);
    //for each restaurant, we parse and store their reviews
    getRestaurants((restaurants) => {
        recurse_restaurants(restaurants, 25);
    })
    // getCategories((categories) => {
    //     console.log(categories);
    //
    // });
    // console.log("Mongo connection started on " + db.host + ":" + db.port);
});

// const restaurantUrl = "https://www.zomato.com/melbourne/thai-ute-ringwood";
//
//
// let parser = new ReviewParser();
// parser.parseReviews(restaurantUrl, (reviews) => {
//     console.log(reviews);
// });
