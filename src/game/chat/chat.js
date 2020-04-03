const Room = require('../../model/room.model');
const Message = require('../../model/message.model');

const sendMessages = async (io, socket, message) => {
    if (!socket.adapter.rooms[socket.socketRoomName]) {
        return;
    }

    socket.in(socket.socketRoomName).broadcast.emit('server-send-new-message', { message: message, owner: 'competitor' });

    var newMessage = new Message({
        userId: socket.socketUserId,
        name: socket.socketUserName,
        message: message
    })

    const mess = await newMessage.save();
    Room.update({ _id: socket.socketRoomId }, { $push: { 'messages': mess._id } }).exec();
}

module.exports = { sendMessages }