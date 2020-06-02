require("../config");
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

db.once("open", async () => {
    const restaurantParser = new RestaurantParser();
    restaurantParser.parse(db);
});