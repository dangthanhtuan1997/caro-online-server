const Room = require('./room.model');
const User = require('../../user/user.model');
const { startGame } = require('../game');

const init = (socket, data) => {
    User.findById(data.userId, (err, user) => {
        if (err) {
            return;
        }

        socket.socketUserId = data.userId;
        socket.socketUserName = data.name;
        socket.socketUserImage = user.userImage;

        socket.leaveAll();

        socket.emit('server-init-success');
    });
    console.log(data.name + ' connected.');
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
    await room.save();

    socket.join(room.name);

    socket.socketRoomName = room.name;
    socket.socketRoomId = room._id;

    //set _id for the room of 2 player
    socket.adapter.rooms[socket.socketRoomName].roomId = room._id;
    socket.adapter.rooms[socket.socketRoomName].idPlayer1 = socket.socketUserId;
    socket.adapter.rooms[socket.socketRoomName].namePlayer1 = socket.socketUserName;
    socket.adapter.rooms[socket.socketRoomName].imagePlayer1 = socket.socketUserImage;

    const res = {
        room: room.name,
        namePlayer1: socket.socketUserName,
        imagePlayer1: socket.socketUserImage
    }

    console.log(res);

    socket.emit('server-send-room', res);
}

const joinRandomRoom = async (io, socket) => {
    var found = false;

    for (r in io.sockets.adapter.rooms) {
        var clientNumber = io.sockets.adapter.rooms[r].length;

        if (r.split('-')[0] === 'room' && clientNumber === 1) {
            found = true;

            socket.socketRoomName = r;
            socket.socketRoomId = io.sockets.adapter.rooms[r].roomId;
            socket.adapter.rooms[socket.socketRoomName].idPlayer2 = socket.socketUserId;
            socket.adapter.rooms[socket.socketRoomName].namePlayer2 = socket.socketUserName;
            socket.adapter.rooms[socket.socketRoomName].imagePlayer2 = socket.socketUserImage;
            socket.join(r);
            console.log(socket.adapter.rooms[socket.socketRoomName]);
            break;
        }
    }

    if (found) {
        var room = await Room.findById(socket.adapter.rooms[socket.socketRoomName].roomId);

        if (room) {
            room.player_2 = socket.socketUserId;
            room.status = 'playing';
            room.XFirst = Math.random() >= 0.5;
            await room.save();

            const res = {
                room: room.name,
                namePlayer1: socket.adapter.rooms[socket.socketRoomName].namePlayer1,
                imagePlayer1: socket.adapter.rooms[socket.socketRoomName].imagePlayer1,
                namePlayer2: socket.adapter.rooms[socket.socketRoomName].namePlayer2,
                imagePlayer2: socket.adapter.rooms[socket.socketRoomName].imagePlayer2
            }
            
            io.sockets.in(socket.socketRoomName).emit('server-send-room', res);
            io.sockets.in(socket.socketRoomName).emit('server-init-game');
            startGame(io, socket);
        }
    }
    else {
        createNewRoom(io, socket);
    }
}

module.exports = { init, createNewRoom, joinRandomRoom }