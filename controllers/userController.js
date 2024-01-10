const User = require('../models/user');
const asyncHandler = require('express-async-handler');

// Display all users
exports.getUsers = asyncHandler(async (req, res, next) => {
  // insert code
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
