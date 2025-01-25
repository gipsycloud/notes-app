const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
  googleId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamp: true });

module.exports = mongoose.model('User', UserSchema);