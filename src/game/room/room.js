const Room = require('./room.model');
const {startGame} = require('../game');

const init = (socket, data) => {
    socket.socketUserId = data.userId;
    socket.socketUserName = data.name;
    leaveAllRoom(socket);
}

const leaveAllRoom = (socket) => {
    for (r in socket.adapter.rooms) {
        socket.leave(r);
    }
}

const createNewRoom = async (io, socket) => {
    const totalRoom = await Room.countDocuments();
    var room = new Room({
        name: 'room-' + (totalRoom + 1),
        player_1: socket.socketUserId,
        player_2: null,
        messages: [],
        winner: null,
        fisrtTurn: null,
        status: 'waitting'
    });
    room.save();

    socket.join(room.name);

    socket.socketRoomName = room.name;
    socket.socketRoomId = room._id;

    //set _id for the room of 2 player
    socket.adapter.rooms[socket.socketRoomName].roomId = room._id;
    socket.adapter.rooms[socket.socketRoomName].player_1 = socket.socketUserId;

    socket.emit('server-send-room', room.name);
}

const joinRandomRoom = async (io, socket) => {
    var found = false;

    for (r in io.sockets.adapter.rooms) {
        var clientNumber = io.sockets.adapter.rooms[r].length;

        if (clientNumber === 1) {
            found = true;

            socket.socketRoomName = r;
            socket.socketRoomId = io.sockets.adapter.rooms[r].roomId;
            socket.adapter.rooms[socket.socketRoomName].player_2 = socket.socketUserId;
            socket.join(r);

            break;
        }
    }

    if (found) {
        var room = await Room.findById(socket.adapter.rooms[socket.socketRoomName].roomId);

        room.player_2 = socket.socketUserId;
        room.status = 'playing';
        room.fisrtTurn = Math.floor(Math.random() * 2) + 1;
        await room.save();

        socket.emit('server-send-room', room.name);
        io.sockets.in(socket.socketRoomName).emit('server-init-game');
        startGame(io, socket);
    }
    else {
        createNewRoom(io, socket);
    }
}

module.exports = { init, createNewRoom, joinRandomRoom }