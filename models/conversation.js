const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  exclude: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  isGroup: { type: Boolean, default: false, required: true },
  image: { type: String },
  groupName: { type: String },
  timestamp: { type: Date, required: true },
});

module.exports = mongoose.model('Conversation', ConversationSchema);
