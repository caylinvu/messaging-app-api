const User = require('../models/user');
const asyncHandler = require('express-async-handler');

// Display all users (excluding email address and password)
exports.getUsers = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find({}, '-email -password').sort({ firstName: 1 }).exec();
  return res.send(allUsers);
});

// Create new user
exports.createUser = asyncHandler(async (req, res, next) => {
  // insert code
});

// Update profile information (first name, last name, image, and status)
exports.updateUser = asyncHandler(async (req, res, next) => {
  // insert code
});

/* ~~~~~~~~~~SOCKET~~~~~~~~~~ */

// Update online status
exports.updateIsOnline = asyncHandler(async (req, res, next) => {
  // insert code
});
