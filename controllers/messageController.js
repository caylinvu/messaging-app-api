const Message = require('../models/message');
const asyncHandler = require('express-async-handler');

// Display all messages from conversations that include the current user
exports.getAllMessages = asyncHandler(async (req, res, next) => {
  const userMessages = await Message.find({ author: req.params.userId })
    .populate('author', '_id firstName lastName')
    .sort({ timestamp: 1 })
    .exec();
  return res.send(userMessages);
});

// Display all messages from a specific conversation
exports.getMessages = asyncHandler(async (req, res, next) => {
  const messagesInConversation = await Message.find({ conversation: req.params.conversationId })
    // .populate('conversation', '-lastMessage -timestamp')
    // .populate('author', 'firstName lastName')
    .sort({ timestamp: 1 })
    .exec();
  return res.send(messagesInConversation);
});

/* ~~~~~~~~~~SOCKET~~~~~~~~~~ */

// Create a message
exports.createMessage = asyncHandler(async (req, res, next) => {
  // insert code
  // need conversationId and authorId
});
