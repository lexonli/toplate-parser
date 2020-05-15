require('dotenv').config();

USERNAME = process.env.MONGO_USERNAME;
PASSWORD = process.env.MONGO_PASSWORD;
MONGO_URL = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0-m1me9.mongodb.net/test?retryWrites=true&w=majority`;
DB_NAME = "toplatedb";