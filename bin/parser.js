// require('../models');
const ReviewParser = require("../parser/review_parser");

const restaurantUrl = "https://www.zomato.com/melbourne/thai-ute-ringwood";

let parser = new ReviewParser();
parser.parseReviews(restaurantUrl, (reviews) => {
    console.log(reviews);
});