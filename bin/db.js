require("../config");
const Category = require("../models/category");
const mongoose = require("mongoose");
const RestaurantParser = require("../parser/restaurant_parser");

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

db.once("open", async () => {
    // const restaurantParser = new RestaurantParser();
    // restaurantParser.parse(db);
    getCategories((categories) => {
        console.log(categories);
    });
    // console.log("Mongo connection started on " + db.host + ":" + db.port);
});