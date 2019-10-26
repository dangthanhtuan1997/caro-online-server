const express = require('express');
const route = express.Router();

module.exports =  (app) => {
    app.use('/users', route);

    route.get('/me', (req, res) => {
        return res.json({ status: 'ok' }).status(200);
    });
};