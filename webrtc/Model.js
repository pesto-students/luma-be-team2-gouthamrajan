const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
  meetingURL: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Meeting', meetingSchema);