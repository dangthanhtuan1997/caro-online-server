const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema(
    {
        username: String,
        name: String,
        email: String,
        dateOfBirth: String,
        sex: String,
        password: String
    },
    {
        timestamps: true
    }
);

var users = mongoose.model('users', UserSchema);

module.exports = users;