const Room = require('./room/room.model');

const startGame = async (io, socket) => {
    var room = await Room.findById(socket.socketRoomId);
    if (room) {
        if (room.fisrtTurn === 1) {
            io.sockets.in(socket.socketRoomName).emit('server-send-turn', room.player_1);
        }
        else {
            io.sockets.in(socket.socketRoomName).emit('server-send-turn', room.player_2);
        }
    }
}

const sendNowTurnToAllClient = async (io, socket) => {
    
}
const updateBoard = (io, socket, data) => {
    console.log(data);
}

module.exports = { startGame, sendNowTurnToAllClient, updateBoard }