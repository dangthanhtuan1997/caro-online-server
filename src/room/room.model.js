const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var RoomSchema = new mongoose.Schema(
    {
        number: Number,
        player_1: Schema.Types.ObjectId,
        player_2: Schema.Types.ObjectId,
        messages: [Schema.Types.ObjectId],
        winner: Schema.Types.ObjectId,
        currentTurn: Schema.Types.ObjectId,
        status: String
    },
    {
        timestamps: true
    }
);

var rooms = mongoose.model('rooms', RoomSchema);

module.exports = rooms;