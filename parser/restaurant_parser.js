const mongoose = require("mongoose");
const axios = require("axios");
const Restaurant = require("../models/restaurant");

const options = {
    headers: {
        'Accept': 'application/json',
        'user-key': '784a653a8e5acb40af67554eb5970fb6'
    }
};

const getURLFromRestaurantData = (restaurantData) => {
    const zomato_url = restaurantData.restaurant.url;
    return zomato_url.substr(0, zomato_url.indexOf("?"));
};

const getRatingsFromRestaurantData = (restaurantData) => {
    const user_rating = restaurantData.restaurant.user_rating;
    return {
        aggregate_rating: user_rating.aggregate_rating,
        votes: user_rating.votes,
    }
};

const getAddressFromRestaurantData = (restaurantData) => {
    const address = restaurantData.restaurant.location;
    return {
        address: address.address,
        zipcode: address.zipcode,
        latitude: address.latitude,
        longitude: address.longitude,
    }
};
class RestaurantParser {
    constructor() {
        this.numberOfRequests = 5;
        this.remainingRequests = 0;
        this.restaurantsPerRequest = 20;
        this.restaurants = [];
    }

    parse(db) {
        this.remainingRequests = this.numberOfRequests;
        for (let i=0; i<this.numberOfRequests; i++) {
            const start = i * this.restaurantsPerRequest;
            fetchAndStoreRestaurantsFromStart(start, (restaurants) => {
                this.remainingRequests -= 1;
                this.restaurants = [...this.restaurants, ...restaurants];
                console.log(restaurants.length);
                console.log(this.remainingRequests);
                if (this.remainingRequests === 0) {
                    this.store(db);
                }
            })
        }
    }

    store(db) {
        Restaurant.insertMany(this.restaurants, {ordered: false}, (err) => {
            if (err !== null) {
                console.log(err);
            }
            console.log("Fetched ", this.restaurants.length, " restaurants");
            db.close()
        });
    }
}

const fetchAndStoreRestaurantsFromStart = (start, callback) => {
    const URL = `https://developers.zomato.com/api/v2.1/search?entity_id=259&entity_type=city&start=${start}&count=20`;
    axios.get(URL, options)
        .then(data => {
            const restaurantArray = data.data.restaurants;
            const restaurants = restaurantArray.map((restaurantData) => {
                 return  {
                    _id: restaurantData.restaurant.id,
                    restaurant_name: restaurantData.restaurant.name,
                    hours: restaurantData.restaurant.timings,
                    address: getAddressFromRestaurantData(restaurantData),
                    image: restaurantData.restaurant.featured_image,
                    ratings: getRatingsFromRestaurantData(restaurantData),
                    zomato_url: getURLFromRestaurantData(restaurantData),
                };
            });
            callback(restaurants);
        })
        .catch(err => {
            console.log(err);
            console.log("fail")
        });
};

module.exports = RestaurantParser;