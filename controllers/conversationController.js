const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const { body, validationResult, check } = require('express-validator');

// Display all conversations which include the current user
exports.getConversations = asyncHandler(async (req, res, next) => {
  const userConversations = await Conversation.find({ members: req.params.userId })
    .populate('lastMessage', 'text timestamp image')
    .exec();
  return res.send(userConversations);
});

// Update group profile information (image and name)
exports.updateConversation = [
  body('groupName', 'Group name is required').trim().isLength({ min: 1 }),
  check('image')
    .custom((value, { req }) => {
      if (!req.file) {
        return true;
      } else if (req.file.mimetype === 'image/png') {
        return '.png';
      } else if (req.file.mimetype === 'image/jpg') {
        return '.jpg';
      } else if (req.file.mimetype === 'image/jpeg') {
        return '.jpeg';
      } else {
        return false;
      }
    })
    .withMessage('Only png, jpg, and jpeg files allowed'),
  check('image')
    .custom((value, { req }) => {
      if (!req.file) {
        return true;
      } else if (req.file.size < 1024 * 1024 * 2) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage('Max file size of 2MB exceeded'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const updatedInfo = {
      groupName: req.body.groupName,
      image: req.file ? req.file.filename : req.body.lastImage,
    };

    // If req.file && req.body.lastImage, then delete last image from files
    if (req.file && req.body.lastImage) {
      fs.unlink(`public/images/${req.body.lastImage}`, (err) => {
        if (err) console.log(err);
      });
    }

    await Conversation.findByIdAndUpdate(
      req.params.conversationId,
      {
        $set: updatedInfo,
      },
      {},
    );

    return res.send(updatedInfo);
  }),
];

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
    if (conversation.image) {
      fs.unlink(`public/images/${conversation.image}`, (err) => {
        if (err) console.log(err);
      });
    }
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
