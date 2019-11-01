const Room = require('./room.model');

const createRoom = async (io, data) => {
    const totalRoom = await Room.countDocuments();
    var room = new Room({
        number: totalRoom + 1,
        player_1: data.userId,
        status: 'empty'
    });
    room.save();
    io.emit('new-room', room.toString());
}

module.exports = { createRoom }