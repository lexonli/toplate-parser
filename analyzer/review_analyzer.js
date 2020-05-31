const Restaurant = require("../models/restaurant");

const MIN_REVIEWS = 5;

class ReviewAnalyzer {
    constructor(restaurant) {
        this.restaurant = restaurant;
    }

    hasValidReviews() {

    }
}

const hasValidReviews = (restaurant) => {
    if (restaurant.reviews.length <= MIN_REVIEWS) {
        return false;
    }
};

const getRegex = (categories) => {
    new RegExp(categori);
};

const analyzeRestaurant = (restaurant, categories) => {
    const PAGE_DATA_REGEX = new RegExp("window\\.__PRELOADED_STATE__ = JSON\\.parse\\((\".+\")\\)");
    const CAPTURING_GROUP = 1;

//successful callback will return json data, you can have a look at example_parseReviewPage_result.json
    const parseReviewPage = (url, callback) => {
        axios.get(url)
            .then(data => {
                let matches = data.data.matchAll(PAGE_DATA_REGEX);
                let match = matches.next().value;
                let matchedData = match[CAPTURING_GROUP];
                callback(JSON.parse(JSON.parse(matchedData)), null)

            };