const Conversation = require('../models/conversation');
const asyncHandler = require('express-async-handler');

// Display all conversations which include the current user
exports.getConversations = asyncHandler(async (req, res, next) => {
  const userConversations = await Conversation.find({ members: req.params.userId })
    .populate('members', '-email -password -status -timestamp -__v -image -isOnline')
    .populate('exclude', '-email -password -status -timestamp -__v -image -isOnline')
    .populate('lastMessage', '-conversation -author -_id -__v')
    .exec();
  return res.send(userConversations);
});

// Update group profile information (image and name)
exports.updateConversation = asyncHandler(async (req, res, next) => {
  const updatedInfo = {
    image: req.body.image,
    groupName: req.body.groupName,
  };

  await Conversation.findByIdAndUpdate(
    req.params.conversationId,
    {
      $set: updatedInfo,
    },
    {},
  );

  return res.send(updatedInfo);
});

// Update group exclusions
exports.updateExclusions = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  const exclusions = conversation.exclude;
  exclusions.push(req.params.userId);

  const updatedInfo = {
    exclude: exclusions,
  };

  await Conversation.findByIdAndUpdate(
    req.params.conversationId,
    {
      $set: updatedInfo,
    },
    {},
  );

  return res.send(updatedInfo);
});

/* ~~~~~~~~~~SOCKET~~~~~~~~~~ */

// Create a conversation
exports.createConversation = asyncHandler(async (req, res, next) => {
  // insert code
  // need memberId's
});

// Update last message
exports.updateLastMessage = asyncHandler(async (req, res, next) => {
  // insert code
  // need new message Id and conversationId
});
