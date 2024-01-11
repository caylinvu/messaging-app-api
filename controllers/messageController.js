const Message = require('../models/message');
const asyncHandler = require('express-async-handler');

// Display all messages from conversations that include the current user
exports.getAllMessages = asyncHandler(async (req, res, next) => {
  // insert code
});

// Display the last message from every conversation a user is apart of
exports.getLastMessages = asyncHandler(async (req, res, next) => {
  // insert code
});

// Display all messages from a specific conversation
exports.getMessages = asyncHandler(async (req, res, next) => {
  // insert code
});

/* ~~~~~~~~~~SOCKET~~~~~~~~~~ */

// Create a message
exports.createMessage = asyncHandler(async (req, res, next) => {
  // insert code
});
