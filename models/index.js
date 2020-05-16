require("../config");

// Exporting one object containing all models
module.exports = {
    Food: require("./food"),
    Dish: require("./dish"),
    Restaurant: require("./restaurant"),
    Recommendation: require("./recommendation"),
    Article: require("./article")
};

//Handle MongoDB connection

// const mongoose = require("mongoose");

// mongoose.connect(MONGO_URL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     dbName: DB_NAME
// });

// const db = mongoose.connection;
// db.on("error", err => {
//     console.error(err);
//     process.exit(1);
// });

// db.once("open", async () => {
//     console.log("Mongo connection started on " + db.host + ":" + db.port);
// });
//
// // get the connection status
// function getConnStates() {
//     return mongoose.connections.map((conn) => {
//         // return conn.readyState;
//         var status = conn.readyState;
//         switch (status) {
//             case 0:
//                 return "Status: 0 => Not Connected";
//             case 1:
//                 return "Status: 1 => Connected";
//             case 2:
//                 return "Status: 2 => Connecting";
//             case 3:
//                 return "Status: 3 => disconnecting";
//
//         }
//     });
// }
//
// // establish the callback of connection status
// const connStates = async (req, res) => {
//     res.send(getConnStates());
// };
//
// module.exports = {
//     connStates
// };