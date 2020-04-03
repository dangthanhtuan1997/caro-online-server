const express = require('express');
const router = express.Router();

const user = require('./user.route');
const auth = require('./auth.route');
const upload = require('./upload.route');

module.exports = () => {
    user(router);
    auth(router);
    upload(router);

    return router;
}