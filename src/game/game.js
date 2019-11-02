const Room = require('./room/room.model');

function clearRoom(io, room, namespace = '/') {
    let roomObj = io.nsps[namespace].adapter.rooms[room];
    if (roomObj) {
        // now kick everyone out of this room
        Object.keys(roomObj.sockets).forEach(function (id) {
            io.sockets.connected[id].leave(room);
        })
    }
}

const startGame = async (io, socket) => {
    socket.adapter.rooms[socket.socketRoomName].currentBoard = Array.from(Array(20), () => new Array(20));
    socket.adapter.rooms[socket.socketRoomName].lastBoard = Array.from(Array(20), () => new Array(20));

    var room = await Room.findById(socket.socketRoomId);
    socket.adapter.rooms[socket.socketRoomName].roomId = room._id;
    if (room) {
        socket.adapter.rooms[socket.socketRoomName].turns = [];
        socket.adapter.rooms[socket.socketRoomName].turns.push(room.XFirst);

        if (room.XFirst === true) {
            socket.in(socket.socketRoomName).broadcast.emit('server-enable-your-turn');
        }
        else {
            socket.emit('server-enable-your-turn');
        }
    }
}

const sendNextTurnToCompetitor = (io, socket) => {
    socket.in(socket.socketRoomName).broadcast.emit('server-enable-your-turn');
}

const updateBoard = (io, socket, data) => {
    // Player_1 default is 'X'
    if (socket.adapter.rooms[socket.socketRoomName].currentBoard[data.x][data.y] === undefined) {
        socket.adapter.rooms[socket.socketRoomName].lastBoard = socket.adapter.rooms[socket.socketRoomName].currentBoard;

        if (socket.socketUserId === socket.adapter.rooms[socket.socketRoomName].player_1) {
            socket.adapter.rooms[socket.socketRoomName].currentBoard[data.x][data.y] = 'X';
        } else {
            socket.adapter.rooms[socket.socketRoomName].currentBoard[data.x][data.y] = 'O';
        }
        sendNextTurnToCompetitor(io, socket);
        io.sockets.in(socket.socketRoomName).emit('server-send-new-message', socket.socketUserName + ' đánh: ' + data.x + ';' + data.y);
    }
}

const setPlayerStayIsWinner = async (io, socket) => {
    socket.leave(socket.socketRoomName);

    var playerExit = socket.socketUserId;
    var roomId = socket.socketRoomId;
    var room = await Room.findById(roomId);

    if (room) {
        room.winner = playerExit === room.player_1 ? room.player_2 : room.player_1;
        room.status = 'end';
        room.save();
    }

    socket.in(socket.socketRoomName).broadcast.emit('you-are-winner');
}

const endTheGameWithoutWinner = async (io, socket) => {
    clearRoom(io, socket.socketRoomName);

    var room = await Room.findById(socket.socketRoomId);

    if (room) {
        room.status = 'end';
        room.save();
    }

    socket.in(socket.socketRoomName).emit('this-game-was-end-without-winner');
}

module.exports = { startGame, updateBoard, setPlayerStayIsWinner, endTheGameWithoutWinner }