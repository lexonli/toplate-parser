const mongoose = require("mongoose");

// import recommendation model
const Restaurant = mongoose.model("restaurant");

const options = {
    //should return restaurants in Melbourne
    //start +20 for each run (by hand
    url: 'https://developers.zomato.com/api/v2.1/search?entity_id=259&entity_type=city&start=0',
    headers: {
        'Accept': 'application/json',
        'user-key': '784a653a8e5acb40af67554eb5970fb6'
    }
};


request(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        const info = JSON.parse(body);
        console.log(info);
        for(var i = 0; i < info.restaurants.length; i++){
            const rest = {
                id: info.restaurants[i].restaurant.id,
                name: info.restaurants[i].restaurant.name,
                hours: info.restaurants[i].restaurant.timings,
                address: info.restaurants[i].restaurant.location,
                images: info.restaurants[i].restaurant.photos,
                ratings: info.restaurants[i].restaurant.user_rating
            };

            //save to collection
            Restaurant.collection.insertOne(rest);


        }

    } else{
        console.log("connection error");
        console.log(error);
    }
});