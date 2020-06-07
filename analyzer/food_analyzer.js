/*
 This script analyzes the data from category, finds the best dishes for each food,
 then populates the Food collection
 */

const Food = require("../models/food");

const analyze_food = (db, categories) => {
    Food.deleteMany({}, (err, docs) => {
        let foods = categories.map((category) => {
            category.dishes
                .sort((a, b) => { return (b.rating - a.rating) });
            let top_dishes = category.dishes.slice(0, 20)
            top_dishes.forEach((dish) => {
                dish._id = dish.dish_id;
            });
            return {
                _id: category._id,
                food_name: category.food_name,
                top_20_dishes: top_dishes
            }
        });
        Food.insertMany(foods, (err, docs) => {
            if (err != null) {
                console.log(err);
            }
            db.close();
        })
    });
};

exports.analyze_food = analyze_food;

