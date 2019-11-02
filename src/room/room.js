const Room = require('./room.model');

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
        currentTurn: null,
        status: 'waitting'
    });
    room.save();

    socket.join(room.name);

    socket.socketRoomName = room.name;
    socket.socketRoomId = room._id;

    //set _id for room
    socket.adapter.rooms[socket.socketRoomName].RoomId = room._id;

    socket.emit('server-send-room', room.toString());
}

const joinRandomRoom = async (io, socket) => {
    var found = false;

    for (r in io.sockets.adapter.rooms) {
        var clientNumber = io.sockets.adapter.rooms[r].length;

        if (clientNumber === 1) {
            found = true;

            socket.socketRoomName = r;
            socket.join(r);

            break;
        }
    }

    if (found) {
        var room = await Room.findById(socket.adapter.rooms[socket.socketRoomName].RoomId);

        room.player_2 = socket.socketUserId;
        room.status = 'playing';
        room.currentTurn = Math.floor(Math.random() * 2) + 1;
        room.save();

        socket.emit('server-send-room', room.toString());
    }
    else {
        createNewRoom(io, socket);
    }
}

module.exports = { init, createNewRoom, joinRandomRoom, leaveAllRoom }