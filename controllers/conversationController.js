const Conversation = require('../models/conversation');
const asyncHandler = require('express-async-handler');

// Display all conversations which include the current user
exports.getConversations = asyncHandler(async (req, res, next) => {
  const userConversations = await Conversation.find({ members: req.params.userId })
    .populate('members', '-email -password')
    .exec();
  return res.send(userConversations);
});

// Update group profile information (image and name)
exports.updateConversation = asyncHandler(async (req, res, next) => {
  // insert code
});

// Update group exclusions
exports.updateExclusions = asyncHandler(async (req, res, next) => {
  // insert code
});

/* ~~~~~~~~~~SOCKET~~~~~~~~~~ */

// Create a conversation
exports.createConversation = asyncHandler(async (req, res, next) => {
  // insert code
});

// Update last message
exports.updateLastMessage = asyncHandler(async (req, res, next) => {
  // insert code
});
