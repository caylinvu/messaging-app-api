const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String },
  bio: { type: String },
  isOnline: { type: Boolean, default: false, required: true },
  timestamp: { type: Date, required: true },
  convData: {
    type: [
      {
        conv: { type: Schema.Types.ObjectId, ref: 'Conversation' },
        lastRead: { type: Date },
        _id: false,
      },
    ],
  },
});

module.exports = mongoose.model('User', UserSchema);
