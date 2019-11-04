const Room = require('.././room/room.model');
const Message = require('../chat/message.model');

const sendMessages = async (io, socket, data) => {
    if (!socket.adapter.rooms[socket.socketRoomName]) {
        return;
    }
    io.sockets.in(socket.socketRoomName).emit('server-send-new-message', data.message.toString());

    var newMessage = new Message({
        userId: socket.socketUserId,
        name: socket.socketUserName,
        message: data.message
    })
    var message = await newMessage.save();
    var room = await Room.findById(socket.socketRoomId);
    if (room) {
        var mess = [...room.messages];
        mess.push(message._id);
        room.messages = mess;
        room.save();
    }
}

module.exports = { sendMessages }