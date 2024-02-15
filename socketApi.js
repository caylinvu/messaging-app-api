const asyncHandler = require('express-async-handler');
const io = require('socket.io')();
const socketApi = {
  io: io,
};

const User = require('./models/user');
const Conversation = require('./models/conversation');
const Message = require('./models/message');

// Socket connection
io.on(
  'connection',
  asyncHandler(async (socket) => {
    // Handle socket connection
    const currentUser = await User.findById(socket.handshake.auth.user, '-email -password').exec();
    currentUser.isOnline = true;

    // Set user.isOnline to true *******
    console.log('A user connected');
    // console.log(socket.handshake.auth);
    // console.log(io.sockets.sockets.get(socket.id).handshake.auth.user);

    // Update in database
    await User.findByIdAndUpdate(
      currentUser._id,
      {
        $set: { isOnline: true },
      },
      {},
    );
    // Emit user.isOnline status to all users
    socket.broadcast.emit('onlineStatus', currentUser);

    // Join rooms of current user
    const conversations = await Conversation.find({ members: currentUser._id }).exec();
    const convArray = conversations.map((conv) => {
      return conv._id.toString();
    });
    socket.join(convArray);

    // Handle socket disconnection
    socket.on(
      'disconnect',
      asyncHandler(async () => {
        // Set user.isOnline to false *******
        console.log('A user disconnected');
        // Update in database
        await User.findByIdAndUpdate(
          currentUser._id,
          {
            $set: { isOnline: false },
          },
          {},
        );
        currentUser.isOnline = false;
        // Emit user.isOnline status to all users
        io.emit('onlineStatus', currentUser);
      }),
    );

    // Create a new conversation
    socket.on(
      'createConversation',
      asyncHandler(async (convData) => {
        // Save conversation to database
        const conversation = new Conversation({
          members: convData.conv.members,
          isGroup: convData.conv.isGroup,
          groupName: convData.conv.groupName,
          timestamp: convData.conv.timestamp,
        });
        await conversation.save();

        console.log('Conversation created in database');

        // Update user conversations in database
        await User.updateMany(
          { _id: { $in: convData.conv.members } },
          {
            $push: {
              convData: {
                conv: conversation._id,
              },
            },
          },
          { multi: true },
        );

        console.log('Conversation added to user data');

        // Join room when creating new conversation
        const currentRoom = conversation._id.toString();
        socket.join(currentRoom);

        // Find other user's socket and join room
        const sockets = await io.fetchSockets();
        const otherSocket = sockets.find((obj) => obj.handshake.auth.user === convData.receiver);
        if (otherSocket) {
          otherSocket.join(currentRoom);
        }

        // Add data to object to send to frontend
        const data = {
          conversation: conversation,
          sender: currentUser._id,
        };

        // console.log(data);

        // Emit the new conversation to relevant users
        io.to(currentRoom).emit('receiveConversation', data);
      }),
    );

    // Listen for a new message
    socket.on(
      'sendMessage',
      asyncHandler(async (msg) => {
        console.log('Message received by server');
        console.log(msg);

        // Save message to database
        const message = new Message({
          text: msg.text,
          author: msg.author,
          conversation: msg.conversation,
          image: msg.image,
          timestamp: msg.timestamp,
        });
        await message.save();

        // Save message as last message in conversation
        await Conversation.findByIdAndUpdate(
          msg.conversation,
          { $set: { lastMessage: message._id } },
          {},
        );

        const currentRoom = message.conversation.toString();

        // Emit message to sockets with current roomId
        io.to(currentRoom).emit('receiveMessage', message);
        io.to(currentRoom).emit('receiveMessagePrev', message);
      }),
    );
  }),
);

module.exports = socketApi;

// ADD TOKEN VERIFICATION
