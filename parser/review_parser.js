const axios = require("axios");

module.exports = class ReviewParser {
    constructor() {
        this.numberOfPages = 0;
        this.reviews = []
    }

    parseReviews(restaurantUrl, callback) {
        this.reviews = [];
        setup(restaurantUrl, (numberOfPages) => {
            this.numberOfPages = numberOfPages;
            //note: pages start at 1
            for (let page = 1; page <= numberOfPages; page++) {
                parseSinglePageReview(restaurantUrl, page, (reviewData, error) => {
                    this.numberOfPages -= 1;
                    if (error === null) {
                        let reviews = Object
                            .values(reviewData)
                            .map((review) => review.reviewText)
                            .filter(review => review !== "");
                        this.reviews.push(...reviews);
                    } else {
                        console.log(`Parsing ${restaurantUrl} at ${page} got error: ${error}`)
                    }
                    if (this.numberOfPages === 0) {
                        callback(this.reviews)
                    }
                })
            }
        })
    };
};

// Setup returns a callback with the number of pages of reviews we need to parse
const setup = (restaurantUrl, callback) => {
    const reviewUrl = `${restaurantUrl}/reviews`;
    parseReviewPage(reviewUrl, (data, error) => {
        if (error === null) {
            let restaurant = data.pages.restaurant;
            let keys = Object.keys(restaurant);
            if (keys.length === 1) {
                let numberOfPages = restaurant[keys[0]].sections.SECTION_REVIEWS.numberOfPages;
                callback(numberOfPages)
            } else {
                console.log("Unexpected extra restaurant parsed.")
            }
        } else {
            console.log(error)
        }
    })
};

// parses a single page with reviews, callback with reviewJSONData
const parseSinglePageReview = (restaurantUrl, page, callback) => {
    const reviewsUrl = `${restaurantUrl}/reviews?page=${page}&sort=dd&filter=reviews-dd`;
    console.log(`Parsing ${reviewsUrl}`);
    parseReviewPage(reviewsUrl, (data, error) => {
        if (error === null) {
            let reviewData = data.entities.REVIEWS;
            callback(reviewData, null)
        } else {
            callback(null, error)
        }
    });
};


//Matching and Parsing block
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

        })
        .catch(err => callback(null, err))
};