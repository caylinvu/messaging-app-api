const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const conversationController = require('../controllers/conversationController');
const messageController = require('../controllers/messageController');
const verifyToken = require('../middleware/verifyToken');

/* GET API home page */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Messaging App API' });
});

// Testing verifyToken
router.get('/token', verifyToken, function (req, res, next) {
  res.render('index', { title: 'Token is valid' });
});

/* ~~~~~~~~~~USERS~~~~~~~~~~ */

// GET all users
router.get('/users', /* verifyToken, */ userController.getUsers);

// POST new users
router.post('/users', userController.createUser);

// PUT user profile information
router.put('/users/:userId', /* verifyToken, */ userController.updateUser);

/* ~~~~~~~~~~CONVERSATIONS~~~~~~~~~~ */

// GET all conversations which include the current user
router.get(
  '/users/:userId/conversations',
  /* verifyToken, */ conversationController.getConversations,
);

// PUT update group profile information (name & image)
router.put(
  '/conversations/:conversationId',
  /* verifyToken, */
  conversationController.updateConversation,
);

// PUT update group exclusions
router.put(
  '/conversations/:conversationId/exclude/:userId',
  /* verifyToken, */
  conversationController.updateExclusions,
);

// PUT update last read timestamp
router.put(
  '/conversations/:conversationId/timestamp/:userId',
  /* verifyToken, */
  conversationController.updateTimestamp,
);

/* ~~~~~~~~~~MESSAGES~~~~~~~~~~ */

// PROBABLY DO NOT NEED THIS ROUTE
// GET all messages from conversations that include the current user
router.get('/users/:userId/all-messages', /* verifyToken, */ messageController.getAllMessages);

// GET all messages from a specifc conversation
router.get(
  '/conversations/:conversationId/messages',
  /* verifyToken, */ messageController.getMessages,
);

module.exports = router;
