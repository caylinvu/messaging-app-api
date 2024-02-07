const Conversation = require('../models/conversation');
const asyncHandler = require('express-async-handler');

// Display all conversations which include the current user
exports.getConversations = asyncHandler(async (req, res, next) => {
  const userConversations = await Conversation.find({ 'members.member': req.params.userId })
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

// Update user's last read timestamp in a conversation
exports.updateTimestamp = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  const updatedMembers = conversation.members.map((obj) => {
    if (req.params.userId === obj.member.toString()) {
      obj.lastRead = req.body.timestamp;
      return obj;
    } else {
      return obj;
    }
  });

  await Conversation.findByIdAndUpdate(
    req.params.conversationId,
    {
      $set: { members: updatedMembers },
    },
    {},
  );

  return res.send({ members: updatedMembers });
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
