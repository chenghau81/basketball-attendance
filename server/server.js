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
  // Set static folder
  const clientBuildPath = path.join(__dirname, '../client/build');
  console.log('Looking for client build at:', clientBuildPath);
  
  let clientBuildExists = false;
  
  try {
    // Check if the directory exists
    const stats = require('fs').statSync(clientBuildPath);
    if (!stats.isDirectory()) {
      console.error('Build path exists but is not a directory');
    } else {
      console.log('Client build directory found');
      // List files in the build directory
      const files = require('fs').readdirSync(clientBuildPath);
      console.log('Files in build directory:', files);
      clientBuildExists = true;
    }
  } catch (err) {
    console.error('Error checking build directory:', err.message);
  }

  // Only serve static files if client build exists
  if (clientBuildExists) {
    // Serve static files
    app.use(express.static(clientBuildPath));
    
    // Any route that doesn't match API will go to index.html
    app.get('*', (req, res) => {
      const indexPath = path.join(clientBuildPath, 'index.html');
      console.log('Trying to serve:', indexPath);
      try {
        if (require('fs').existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          console.error('index.html not found');
          res.status(404).send('Build files not found. Make sure the client build completed successfully.');
        }
      } catch (err) {
        console.error('Error serving index.html:', err.message);
        res.status(500).send('Server error when trying to serve the application');
      }
    });
  } else {
    // Fallback route for API-only mode
    app.get('/', (req, res) => {
      res.send('Basketball Attendance Tracker API Server (API-only mode)');
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