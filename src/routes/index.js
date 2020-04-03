const express = require('express');
const user = require('./user.route');
const auth = require('./auth.route');
const upload = require('./upload.route');

module.exports = () => {
    const router = express.Router();

    user(router);
    auth(router);
    upload(router);

    return router;
}