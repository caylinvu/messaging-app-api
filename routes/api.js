const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const conversationController = require('../controllers/conversationController');
const messageController = require('../controllers/messageController');

/* GET API home page */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Messaging App API' });
});

/* ~~~~~~~~~~USERS~~~~~~~~~~ */

// GET all users
router.get('/users', userController.getUsers);

// POST new users
router.post('/users', userController.createUser);

// PUT user profile information
router.put('/users/:userId', userController.updateUser);

/* ~~~~~~~~~~CONVERSATIONS~~~~~~~~~~ */

// GET all conversations which include the current user
router.get('/users/:userId/conversations', conversationController.getConversations);

// PUT group profile information
router.put('/conversations/:conversationId', conversationController.updateConversation);

// PUT group exclusions
router.put(
  '/conversations/:conversationId/exclude/:userId',
  conversationController.updateExclusions,
);

/* ~~~~~~~~~~MESSAGES~~~~~~~~~~ */

// GET all messages from conversations that include the current user
router.get('/users/:userId/all-messages', messageController.getAllMessages);

// GET all messages from a specifc conversation
router.get('/conversations/:conversationId/messages', messageController.getMessages);

module.exports = router;
