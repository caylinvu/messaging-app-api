const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

// Display all conversations which include the current user
exports.getConversations = asyncHandler(async (req, res, next) => {
  const userConversations = await Conversation.find({ members: req.params.userId })
    .populate('lastMessage', 'text timestamp image')
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

// Update group exclusions (or delete conv if all users in group > 2 are excluded)
exports.addExclusion = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.conversationId).exec();
  const exclusions = conversation.exclude;

  const updatedInfo = {
    exclude: [...exclusions, req.params.userId],
  };

  if (
    conversation.members.length > 2 &&
    updatedInfo.exclude.length === conversation.members.length
  ) {
    await Promise.all([
      await Conversation.findByIdAndDelete(req.params.conversationId),
      await Message.deleteMany({ conversation: req.params.conversationId }),
      await User.updateMany(
        { _id: { $in: conversation.members } },
        {
          $pull: { convData: { conv: req.params.conversationId } },
        },
        { multi: true },
      ),
    ]);
  } else {
    await Conversation.findByIdAndUpdate(
      req.params.conversationId,
      {
        $set: updatedInfo,
      },
      {},
    );
  }

  return res.send(updatedInfo);
});

// Remove an id from exclusions (only on conversations between 2 people)
exports.removeExclusion = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.conversationId).exec();
  const exclusions = conversation.exclude.filter((obj) => obj.toString() !== req.params.userId);

  console.log(exclusions);

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
