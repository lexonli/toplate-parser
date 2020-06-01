const Restaurant = require("../models/restaurant");
const Category = require("../models/category");
const Dish = require("../models/dish");
const AhoCorasick = require('ahocorasick');
const Sentiment = require('sentiment');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

class ReviewAnalyzer {
    constructor(restaurants, categories) {
        this.restaurants = restaurants;
        this.mapper = buildMapper(categories);
        this.foodDishes = categories.reduce((total, category) => {
            return [...total, ...category.food_dishes]
        }, []);
        this.ac = new AhoCorasick(this.foodDishes);
        this.sentiment = new Sentiment();
        //food structure (foodId : [Dish])
        this.food = {};
        this.dishes = [];
    }

    analyze(db) {
        let remainingRestaurants = this.restaurants.length;
        this.restaurants.forEach((restaurant) => {
            let dishScores = this.getDishScoresFromReviews(restaurant.reviews);
            this.generateDishes(dishScores, restaurant, () => {
                remainingRestaurants -= 1;
                if (remainingRestaurants === 0) {
                    console.log("Stored new dishes into restaurant collection");
                    this.storeIntoCategoryAndDishCollection(db)
                }
            })
        });
    }

    storeIntoCategoryAndDishCollection(db) {
        this.storeIntoCategoryCollection(() => {
            console.log("Stored new dishes into category collection");
            this.storeIntoDishCollection(() => {
                console.log("Stored new dishes into dish collection");
                db.close();
            })
        });
    }

    getDishScoresFromReviews(reviews) {
        let dishToScores = {};
        reviews.forEach((review) => {
            const result = this.ac.search(review.toLowerCase());
            if (result.length > 0) {
                const score = this.sentiment.analyze(review).score;
                result.forEach((match) => {
                    let dish = match[1][0];
                    if (dishToScores.hasOwnProperty(dish)) {
                        dishToScores[dish].push(score);
                    } else {
                        dishToScores[dish] = [score];
                    }
                })
            }
        });
        return dishToScores;
    };

    generateDishes(dishToScores, restaurant, callback) {
        if (isEmpty(dishToScores)) {
            callback();
            return;
        }
        let restaurantDishes = [];
        for (const [dish, scores] of Object.entries(dishToScores)) {
            const foodId = this.mapper[dish].foodId;
            let dishObject = {
                dish_id: uuidv4(),
                dish_name: dish,
                food: foodId,
                rating: getAvg(scores),
                restaurant_id: restaurant._id,
                restaurant_name: restaurant.restaurant_name,
                image_url: restaurant.image
            };

            //for storing into dish collection and restaurant collection at dishes
            this.dishes.push(dishObject);
            restaurantDishes.push(dishObject);

            //for storing into food collection
            if (this.food.hasOwnProperty(foodId)) {
                this.food[foodId].push(dishObject);
            } else {
                this.food[foodId] = [dishObject];
            }
        }
        this.storeIntoRestaurantCollection(restaurant, restaurantDishes, callback);
    }

    storeIntoCategoryCollection(callback) {
        let remaining = Object.keys(this.food).length;
        for (const [foodId, dishes] of Object.entries(this.food)) {
            Category.updateOne({ _id: mongoose.Types.ObjectId(foodId) }, { dishes: dishes }, (err, res) => {
                if (err != null) {
                    console.log(err);
                }
                remaining -= 1;
                if (remaining === 0) {
                    callback();
                }
            });
        }
    }

    storeIntoDishCollection(callback) {
        let cleanedDishes = this.dishes.map((dish) => {
            return {
                _id: dish.dish_id,
                dish_name: dish.dish_name,
                food: mongoose.Types.ObjectId(dish.food_id),
                rating: dish.rating,
                restaurant: dish.restaurant_id,
                image_url: dish.image_url,
            }
        });
        Dish.insertMany(cleanedDishes, (err, docs) => {
            if (err != null) {
                console.log(err);
            }
            callback()
        })
    }

    storeIntoRestaurantCollection(restaurant, restaurantDishes, callback) {
        Restaurant.updateOne({ _id: restaurant._id}, {dishes: restaurantDishes}, (err, res) => {
            if (err != null) {
                console.log(err);
            }
            callback();
        })
    }
}

const getAvg = (scores) => {
    const total = scores.reduce((acc, c) => acc + c, 0);
    return total / scores.length;
};

const isEmpty = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const buildMapper = (categories) => {
    let mapper = {};
    categories.forEach((category) => {
        category.food_dishes.forEach((dish) => {
            mapper[dish] = {"foodId": category._id, "foodName": category.food_name};
        })
    });
    return mapper
};

module.exports = ReviewAnalyzer;