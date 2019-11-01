const Room = require('./room.model');

const createRoom = async (io, socket, data) => {
    const totalRoom = await Room.countDocuments();
    var room = new Room({
        number: totalRoom + 1,
        player_1: data.userId,
        status: 'empty'
    });
    room.save();
    socket.leave(socket.id);
    for (r in socket.adapter.rooms) {
        socket.leave(r);
    }
    socket.join('room-' + room.number);
    socket.currentRoom = null;
    for (r in socket.adapter.rooms) {
        socket.currentRoom = r;
    }
    io.emit('server-send-current-room', socket.currentRoom);
}

module.exports = { createRoom }