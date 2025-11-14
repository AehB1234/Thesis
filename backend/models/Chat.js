const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => `chat-${Date.now()}`
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  preview: {
    type: String,
    default: 'Start a new conversation...'
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    default: 'mental_health'
  }
}, {
  timestamps: true,
  _id: false
});

module.exports = mongoose.model('Chat', chatSchema);