const Room = require('../room.model');
const Message = require('../chat/message.model');

const sendMessages = (io, data) => {
    var message = new Message({
        userId: data.userId,
        name: data.name,
        message: data.message
    })
    message.save((err, message) => {
        Room.findById({ _id: data.roomId }, (err, room) => {
            if (room) {
                var mess = [...room.messages];
                mess.push(message._id);
                room.messages = mess;
                room.save();
            }
        });
    })
    io.emit('server-send-new-message', message.toString());
}

module.exports = { sendMessages }