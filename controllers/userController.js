const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { body, validationResult, check } = require('express-validator');

// Display all users (excluding email address and password)
exports.getUsers = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find({}, '-email -password').sort({ firstName: 1 }).exec();
  return res.send(allUsers);
});

// Create new user
exports.createUser = [
  body('firstName', 'First name is required').trim().isLength({ min: 1 }),
  body('lastName', 'Last name is required').trim().isLength({ min: 1 }),
  body('email')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Email address is required')
    .bail()
    .isEmail()
    .withMessage('Please enter valid email address')
    .custom(
      asyncHandler(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error('Email address already in use');
        } else {
          return true;
        }
      }),
    ),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password is required')
    .bail()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage(
      'Password must contain at least 8 characters and include the following: 1 uppercase, 1 lowercase, and 1 number',
    ),
  body('passwordConf')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password confirmation is required')
    .bail()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('Password does not match'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      timestamp: req.body.timestamp,
    });

    bcrypt.hash(
      req.body.password,
      10,
      asyncHandler(async (err, hashedPassword) => {
        user.password = hashedPassword;
        if (err) {
          return res.status(400).json(err);
        } else {
          await user.save();
          jwt.sign({ user: user }, process.env.secret_key, (err, token) => {
            res.json({
              user: {
                _id: user._id,
                token: token,
              },
            });
          });
        }
      }),
    );
  }),
];

// Update profile information (first name, last name, image, and status)
exports.updateUser = [
  body('firstName', 'First name is required').trim().isLength({ min: 1 }),
  body('lastName', 'Last name is required').trim().isLength({ min: 1 }),
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
  body('bio').trim(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const updatedInfo = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      image: req.file ? req.file.filename : req.body.lastImage,
      bio: req.body.bio,
    };

    // If req.file && req.body.lastImage, then delete last image from files
    if (req.file && req.body.lastImage) {
      fs.unlink(`public/images/${req.body.lastImage}`, (err) => {
        if (err) console.log(err);
      });
    }

    await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: updatedInfo,
      },
      {},
    );

    return res.send(updatedInfo);
  }),
];

// Update user's last read timestamp in conversation
exports.updateTimestamp = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId).exec();
  const updatedConvs = user.convData.map((obj) => {
    if (req.params.conversationId === obj.conv.toString()) {
      obj.lastRead = req.body.timestamp;
      return obj;
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
