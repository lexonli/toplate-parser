require("../config");
const Restaurant = require("../models/restaurant");
const Category = require("../models/category");
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

const useDB = (callback) => {
    db.once("open", async () => {
        callback(db);
    })
};

//must be called within useDB
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

//must be called within useDB
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

exports.useDB = useDB;
exports.getCategories = getCategories;
exports.getRestaurants = getRestaurants;