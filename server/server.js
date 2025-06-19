const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL // Use specific client URL in production
    : 'http://localhost:3000' // Allow localhost in development
}));
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Only use the MONGODB_URI environment variable without fallback to localhost
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable not set');
    }
    console.log('Attempting to connect to MongoDB with URI:', 
      process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Log URI with hidden password
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Don't exit process - let the server run in API-only mode
  }
};
connectDB();

// Routes
const attendanceRoutes = require('./routes/attendance');
const playerRoutes = require('./routes/players');

app.use('/api/attendance', attendanceRoutes);
app.use('/api/players', playerRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Check file system
  const fs = require('fs');
  
  // Set static folder path
  const clientBuildPath = path.join(__dirname, '../client/build');
  console.log('Looking for client build at:', clientBuildPath);
  
  try {
    // Try to create the directory if it doesn't exist
    if (!fs.existsSync(clientBuildPath)) {
      console.log('Client build directory does not exist, creating it...');
      fs.mkdirSync(clientBuildPath, { recursive: true });
      
      // Create a simple index.html file
      const indexPath = path.join(clientBuildPath, 'index.html');
      fs.writeFileSync(indexPath, '<!DOCTYPE html><html><head><title>Basketball Attendance</title></head><body><div id="root">Basketball Attendance Tracker</div></body></html>');
      console.log('Created basic index.html file');
    }
    
    console.log('Client build directory exists, checking contents...');
    const files = fs.readdirSync(clientBuildPath);
    console.log('Files in build directory:', files);
    
    // Serve static files
    app.use(express.static(clientBuildPath));
    
    // Any route that doesn't match API will go to index.html
    app.get('*', (req, res) => {
      try {
        const indexPath = path.join(clientBuildPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          console.error('index.html not found');
          res.send('Basketball Attendance Tracker API (index.html not found)');
        }
      } catch (err) {
        console.error('Error serving index.html:', err);
        res.send('Basketball Attendance Tracker API (Error serving index.html)');
      }
    });
  } catch (err) {
    console.error('Error with client build directory:', err);
    // Fallback route if all else fails
    app.get('/', (req, res) => {
      res.send('Basketball Attendance Tracker API (Client build unavailable)');
    });
  }
} else {
  // Root route for development
  app.get('/', (req, res) => {
    res.send('Basketball Attendance Tracker API');
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 