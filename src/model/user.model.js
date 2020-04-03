const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema(
    {
        username: String,
        name: String,
        email: String,
        dateOfBirth: String,
        gender: String,
        password: String,
        facebookId: String,
        googleId: String,
        voucher: [Schema.Types.ObjectId],
        userImage: {
            type: String,
            default: '/uploads/default_avatar.png'
        },
        role: { type: String, default: 'user' }
    },
    {
        timestamps: true
    }
);

var users = mongoose.model('users', UserSchema);

module.exports = users;