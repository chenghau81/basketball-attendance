const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  sessionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  players: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true
    },
    present: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      default: ''
    }
  }],
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Attendance', AttendanceSchema); 