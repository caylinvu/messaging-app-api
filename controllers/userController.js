const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// Display all users (excluding email address and password)
exports.getUsers = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find({}, '-email -password').sort({ firstName: 1 }).exec();
  return res.send(allUsers);
});

// Create new user
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    timestamp: req.body.timestamp,
  });

  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    user.password = hashedPassword;
    await user.save();
  });

  return res.send(user);
});

// Update profile information (first name, last name, image, and status)
exports.updateUser = asyncHandler(async (req, res, next) => {
  const updatedInfo = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    image: req.body.image,
    bio: req.body.bio,
  };

  await User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: updatedInfo,
    },
    {},
  );

  return res.send(updatedInfo);
});

// Update user's last read timestamp in conversation
exports.updateTimestamp = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId).exec();
  const updatedConvs = user.convData.map((obj) => {
    if (req.params.conversationId === obj.conv.toString()) {
      return {
        ...obj,
        lastRead: req.body.timestamp,
      };
    } else {
      return obj;
    }
  });

  await User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: { convData: updatedConvs },
    },
    {},
  );

  return res.send({ convData: updatedConvs });
});

/* ~~~~~~~~~~SOCKET~~~~~~~~~~ */

// Update online status
exports.updateIsOnline = asyncHandler(async (req, res, next) => {
  // insert code
  // need userId
});
