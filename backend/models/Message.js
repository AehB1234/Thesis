const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chat: {
    type: String,
    ref: 'Chat',
    required: true
  },
  from_user: {
    type: Boolean,
    required: true
  },
  message_content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);