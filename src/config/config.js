const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if (!envFound) {
    throw new Error("Couldn't find .env file");
}

var port = parseInt(process.env.PORT, 10);

var databaseURL = process.env.MONGODB_URI;

var jwtSecret = process.env.JWT_SECRET;

var api = {
    prefix: '/api'
}

var saltRounds = 10;

var FACEBOOK = {
    FACEBOOK_APP_ID: '627664211100376',
    FACEBOOK_APP_SECRET: '04c38b0fc1dca0ef77fcc70fa185b2b9',
    CALLBACK_URL : 'http://localhost:3000' + '/api/auth/facebook/callback'
}

module.exports = {port, databaseURL, jwtSecret, api, saltRounds, FACEBOOK};