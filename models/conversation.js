const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  exclude: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isGroup: { type: Boolean, default: false, required: true },
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  image: { type: String },
  groupName: { type: String },
});

module.exports = mongoose.model('Conversation', ConversationSchema);
