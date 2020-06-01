require("../config");
const Category = require("../models/category");
const Restaurant = require("../models/restaurant");
const ReviewAnalyzer = require("../analyzer/review_analyzer");
const mongoose = require("mongoose");

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

db.once("open", async () => {
    getCategories((categories) => {
        getRestaurants((restaurants) => {
            const reviewAnalyzer = new ReviewAnalyzer(restaurants, categories);
            reviewAnalyzer.analyze(db);
        });
    });
});
