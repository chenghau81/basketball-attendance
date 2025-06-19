const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Attendance = require('../models/Attendance');

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find().sort({ name: 1 });
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get player attendance statistics
router.get('/stats', async (req, res) => {
  console.log('Fetching player attendance statistics');
  try {
    // Get all players
    const players = await Player.find();
    console.log(`Found ${players.length} players`);
    
    // Get all attendance records
    const attendanceRecords = await Attendance.find();
    console.log(`Found ${attendanceRecords.length} attendance records`);
    
    // Calculate attendance stats for each player
    const playerStats = await Promise.all(players.map(async (player) => {
      // Count sessions where player was present
      let sessionsPresent = 0;
      let totalSessions = 0;
      
      // Loop through all attendance records to check if player was present
      attendanceRecords.forEach(record => {
        const playerRecord = record.players.find(
          p => p.player && (p.player.toString() === player._id.toString())
        );
        
        if (playerRecord) {
          totalSessions++;
          if (playerRecord.present) {
            sessionsPresent++;
          }
        }
      });
      
      // Calculate attendance percentage
      const attendancePercentage = totalSessions > 0 
        ? Math.round((sessionsPresent / totalSessions) * 100) 
        : 0;
      
      return {
        _id: player._id,
        name: player.name,
        email: player.email,
        active: player.active,
        sessionsPresent,
        totalSessions,
        attendancePercentage
      };
    }));
    
    console.log('Player stats calculated successfully:', playerStats);
    res.json(playerStats);
  } catch (err) {
    console.error('Error calculating player stats:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get single player
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create player
router.post('/', async (req, res) => {
  try {
    const player = new Player({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    });
    
    const newPlayer = await player.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update player
router.put('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    if (req.body.name) player.name = req.body.name;
    if (req.body.email) player.email = req.body.email;
    if (req.body.phone) player.phone = req.body.phone;
    if (req.body.active !== undefined) player.active = req.body.active;
    
    const updatedPlayer = await player.save();
    res.json(updatedPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete player
router.delete('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    await player.deleteOne();
    res.json({ message: 'Player removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 