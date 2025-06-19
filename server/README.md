# Basketball Attendance Tracker - Backend

Backend server for the basketball attendance tracking application.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the server root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/basketball-attendance
```

3. Make sure MongoDB is installed and running on your system.

## Running the Server

Development mode (with auto-restart):
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get a single player
- `POST /api/players` - Create a new player
- `PUT /api/players/:id` - Update a player
- `DELETE /api/players/:id` - Delete a player

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/:id` - Get a single attendance record
- `GET /api/attendance/date/:date` - Get attendance for a specific date (format: YYYY-MM-DD)
- `POST /api/attendance` - Create a new attendance record
- `PUT /api/attendance/:id` - Update an attendance record
- `PATCH /api/attendance/:id/player/:playerId` - Update a single player's attendance
- `DELETE /api/attendance/:id` - Delete an attendance record 