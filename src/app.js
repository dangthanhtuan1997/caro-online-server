const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');
const routes = require('./api');
const passport = require('./passport/passport');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { sendMessages } = require('./room/chat/chat');
const { createRoom } = require('./room/room');

const PORT = process.env.PORT || config.port;
const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(config.api.prefix, routes());

app.use(cookieParser());

app.use(passport.initialize());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mongoose.connect(config.databaseURL, {
    useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

const server = app.listen(PORT, err => {
    if (err) {
        console.log(err);
        process.exit(1);
        return;
    }
    console.log('App running at port: ' + PORT);
});

const io = require('socket.io').listen(server);

io.on('connection', socket => {
    console.log(socket.id + ' connected');

    socket.on('send-message', data => sendMessages(io, data));

    socket.on('create-room', data => createRoom(io, data));
})