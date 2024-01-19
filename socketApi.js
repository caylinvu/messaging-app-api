const asyncHandler = require('express-async-handler');
const io = require('socket.io')();
const socketApi = {
  io: io,
};

const Conversation = require('./models/conversation');
const Message = require('./models/message');

// Socket connection
io.on('connection', (socket) => {
  // Set user.isOnline to true *******
  console.log('A user connected');
  console.log(socket.request.user);
  // Update in database
  // Emit user.isOnline status to all users

  // Socket disconnection
  socket.on('disconnect', () => {
    // Set user.isOnline to false *******
    console.log('A user disconnected');
    // Update in database
    // Emit user.isOnline status to all users
  });

  // JOIN CURRENT USER'S ROOMS:
  // Get array of current user's rooms (send from frontend with socket info)
  // Use socket.join(array); to join all rooms
  // Join room when creating a new conversation and emit new conv only to that room
  // Emit new messages only to room with the current conversation id

  // Create a new conversation
  socket.on(
    'createConversation',
    asyncHandler(async (conv) => {
      // Save conversation to database
      const conversation = new Conversation({
        members: conv.members,
        isGroup: conv.isGroup,
        groupName: conv.groupName,
      });
      await conversation.save();

      console.log('Conversation created in database');

      // Emit the new conversation to relevant users
      io.emit('createConversation', conversation);
    }),
  );

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
      io.emit('message', message);
    }),
  );
});

module.exports = socketApi;
