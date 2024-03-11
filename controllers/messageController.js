const Message = require('../models/message');
const Conversation = require('../models/conversation');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// Display all messages from a specific conversation
exports.getMessages = asyncHandler(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.conversationId)) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  const conv = await Conversation.findById(req.params.conversationId).exec();
  if (!conv) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  const messagesInConversation = await Message.find({ conversation: req.params.conversationId })
    // .populate('conversation', '-lastMessage -timestamp')
    // .populate('author', 'firstName lastName')
    .sort({ timestamp: 1 })
    .exec();
  return res.send(messagesInConversation);
});

// Upload an image linked to a message
exports.uploadImage = asyncHandler(async (req, res, next) => {
  console.log('image uploaded successfully');
  const uploadInfo = {
    image: req.file.filename,
  };
  console.log(uploadInfo);
  return res.send(uploadInfo);
});

/* ~~~~~~~~~~SOCKET~~~~~~~~~~ */

// Create a message
exports.createMessage = asyncHandler(async (req, res, next) => {
  // insert code
  // need conversationId and authorId
});
