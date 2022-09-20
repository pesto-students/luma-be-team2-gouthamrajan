const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isExpert: {
    type: Boolean,
    default: false,
  },
  seenNotifications: {
    type: Array,
    default: [],
  },
  unseenNotifications: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('User', userSchema);
