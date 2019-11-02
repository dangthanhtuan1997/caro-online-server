const Room = require('./room/room.model');

const startGame = async (io, socket) => {
    var room = await Room.findById(socket.socketRoomId);
    if (room) {
        socket.adapter.rooms[socket.socketRoomName].turns = [];
        socket.adapter.rooms[socket.socketRoomName].turns.push(room.fisrtTurn);

        if (room.fisrtTurn === 1) {
            io.sockets.in(socket.socketRoomName).emit('server-send-turn', room.player_1);
        }
        else {
            io.sockets.in(socket.socketRoomName).emit('server-send-turn', room.player_2);
        }
    }
}

const sendCurrentTurnToAllClient = (io, socket) => {
    var lastTurn = socket.adapter.rooms[socket.socketRoomName].turns.slice(-1)[0];
    if (lastTurn === 1) {
        socket.adapter.rooms[socket.socketRoomName].turns.push(2);
        io.sockets.in(socket.socketRoomName).emit('server-send-turn', socket.adapter.rooms[socket.socketRoomName].player_2);
    }
    else {
        socket.adapter.rooms[socket.socketRoomName].turns.push(1);
        io.sockets.in(socket.socketRoomName).emit('server-send-turn', socket.adapter.rooms[socket.socketRoomName].player_1);
    }
}
const updateBoard = (io, socket, data) => {
    console.log(data);
    sendCurrentTurnToAllClient(io, socket);
}

module.exports = { startGame, sendCurrentTurnToAllClient, updateBoard }