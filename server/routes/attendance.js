const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Player = require('../models/Player');

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .sort({ sessionDate: -1 })
      .populate('players.player', 'name email');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single attendance record
router.get('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('players.player', 'name email');
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get attendance record by date
router.get('/date/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    
    const attendance = await Attendance.findOne({
      sessionDate: { 
        $gte: date,
        $lt: nextDay
      }
    }).populate('players.player', 'name email');
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found for this date' });
    }
    
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create attendance record
router.post('/', async (req, res) => {
  try {
    // Get all active players
    const players = await Player.find({ active: true });
    
    // Create new attendance record with all players set to absent by default
    const attendance = new Attendance({
      sessionDate: req.body.sessionDate || new Date(),
      players: players.map(player => ({
        player: player._id,
        present: false
      })),
      notes: req.body.notes || ''
    });
    
    const newAttendance = await attendance.save();
    
    // Populate player details for the response
    const populatedAttendance = await Attendance.findById(newAttendance._id)
      .populate('players.player', 'name email');
    
    res.status(201).json(populatedAttendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update entire attendance record
router.put('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    if (req.body.sessionDate) attendance.sessionDate = req.body.sessionDate;
    if (req.body.notes !== undefined) attendance.notes = req.body.notes;
    if (req.body.players) {
      // Replace the player attendance data
      attendance.players = req.body.players;
    }
    
    const updatedAttendance = await attendance.save();
    
    const populatedAttendance = await Attendance.findById(updatedAttendance._id)
      .populate('players.player', 'name email');
    
    res.json(populatedAttendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update attendance for a single player
router.patch('/:id/player/:playerId', async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    const playerIndex = attendance.players.findIndex(
      p => p.player.toString() === req.params.playerId
    );
    
    if (playerIndex === -1) {
      return res.status(404).json({ message: 'Player not found in this attendance record' });
    }
    
    // Update player's presence
    if (req.body.present !== undefined) {
      attendance.players[playerIndex].present = req.body.present;
    }
    
    // Update player's notes if provided
    if (req.body.notes !== undefined) {
      attendance.players[playerIndex].notes = req.body.notes;
    }
    
    const updatedAttendance = await attendance.save();
    
    const populatedAttendance = await Attendance.findById(updatedAttendance._id)
      .populate('players.player', 'name email');
    
    res.json(populatedAttendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete attendance record
router.delete('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    await attendance.deleteOne();
    res.json({ message: 'Attendance record removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 