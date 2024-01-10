const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  body: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: new Date(), required: true },
  image: { type: String },
});

module.exports = mongoose.model('Message', MessageSchema);
