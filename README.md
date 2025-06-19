# Basketball Attendance Tracker

A complete web application for tracking attendance at weekly basketball training sessions. 

## Features

- Track player attendance for weekly sessions
- Manage player information 
- View attendance history and statistics
- Mobile-friendly responsive design

## Tech Stack

- **Frontend**: React, React Bootstrap, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Project Structure

```
basketball-attendance/
├── client/                  # React frontend
│   ├── public/              # Static assets
│   ├── src/                 # React source code
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context for state management
│   │   ├── utils/           # Utility functions including API
│   │   ├── App.js           # Main React component
│   │   └── index.js         # Entry point
│   └── package.json         # Frontend dependencies
└── server/                  # Node.js backend
    ├── models/              # MongoDB models
    ├── routes/              # Express routes
    ├── server.js            # Server entry point
    └── package.json         # Backend dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Clone the repository

2. Install backend dependencies
```
cd basketball-attendance/server
npm install
```

3. Install frontend dependencies
```
cd ../client
npm install
```

4. Configure environment variables
   - Create a `.env` file in the server directory with the following:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/basketball-attendance
     ```

### Running the Application

1. Start the backend server
```
cd server
npm run dev
```

2. Start the frontend application (in a new terminal)
```
cd client
npm start
```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. First, add players using the Player Management page
2. Take attendance for each session using the Take Attendance page
3. View history and statistics on the Dashboard and Attendance History pages 