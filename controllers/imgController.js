const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require('../models/message');

// Display user profile picture
exports.getUserImage = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  return res.sendFile(`/images/${user.image}`, { root: 'public' });
});

// Display group chat image
exports.getGroupImage = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  return res.sendFile(`/images/${conversation.image}`, { root: 'public' });
});

// Display message image
exports.getMessageImage = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.messageId);
  return res.sendFile(`/images/${message.image}`, { root: 'public' });
});
