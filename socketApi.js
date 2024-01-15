const asyncHandler = require('express-async-handler');
const io = require('socket.io')();
const socketApi = {
  io: io,
};

const Conversation = require('./models/conversation');
const Message = require('./models/message');

// Socket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Socket disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  // Listen for a new message
  socket.on(
    'message',
    asyncHandler(async (msg) => {
      console.log('Message received by server');
      console.log(msg);

      // Save message to database
      const message = new Message({
        text: msg.text,
        author: msg.author,
        conversation: msg.conversation,
        image: msg.image,
      });
      await message.save();

      // Save message as last message in conversation
      await Conversation.findByIdAndUpdate(
        msg.conversation,
        { $set: { lastMessage: message._id } },
        {},
      );

      // Emit message to sockets
      io.emit('message', msg);
    }),
  );
});

module.exports = socketApi;

// socketApi.sendNotification = function () {
//   io.sockets.emit('hello', { msg: 'Hello World!' });
// };
