import axios from 'axios';

// Get the API base URL
const getBaseURL = () => {
  // Use deployed API URL if available
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Otherwise use proxy configured in package.json for development
  return '/api';
};

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Player API
export const playerAPI = {
  // Get all players
  getPlayers: async () => {
    try {
      const response = await apiClient.get('/players');
      return response.data;
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  },

  // Get player attendance statistics
  getPlayerStats: async () => {
    console.log('Calling player stats API endpoint');
    try {
      const response = await apiClient.get('/players/stats');
      console.log('Player stats API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching player statistics:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      throw error;
    }
  },

  // Get a single player
  getPlayer: async (id) => {
    try {
      const response = await apiClient.get(`/players/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching player ${id}:`, error);
      throw error;
    }
  },

  // Create a new player
  createPlayer: async (playerData) => {
    try {
      const response = await apiClient.post('/players', playerData);
      return response.data;
    } catch (error) {
      console.error('Error creating player:', error);
      throw error;
    }
  },

  // Update a player
  updatePlayer: async (id, playerData) => {
    try {
      const response = await apiClient.put(`/players/${id}`, playerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating player ${id}:`, error);
      throw error;
    }
  },

  // Delete a player
  deletePlayer: async (id) => {
    try {
      const response = await apiClient.delete(`/players/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting player ${id}:`, error);
      throw error;
    }
  }
};

// Attendance API
export const attendanceAPI = {
  // Get all attendance records
  getAllAttendance: async () => {
    try {
      const response = await apiClient.get('/attendance');
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }
  },

  // Get a single attendance record
  getAttendance: async (id) => {
    try {
      const response = await apiClient.get(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance record ${id}:`, error);
      throw error;
    }
  },

  // Get attendance by date
  getAttendanceByDate: async (date) => {
    try {
      // Format date as YYYY-MM-DD
      const formattedDate = date instanceof Date 
        ? date.toISOString().split('T')[0]
        : date;
      const response = await apiClient.get(`/attendance/date/${formattedDate}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      console.error(`Error fetching attendance for date ${date}:`, error);
      throw error;
    }
  },

  // Create a new attendance record
  createAttendance: async (attendanceData) => {
    try {
      const response = await apiClient.post('/attendance', attendanceData);
      return response.data;
    } catch (error) {
      console.error('Error creating attendance record:', error);
      throw error;
    }
  },

  // Update an attendance record
  updateAttendance: async (id, attendanceData) => {
    try {
      const response = await apiClient.put(`/attendance/${id}`, attendanceData);
      return response.data;
    } catch (error) {
      console.error(`Error updating attendance record ${id}:`, error);
      throw error;
    }
  },

  // Update a single player's attendance
  updatePlayerAttendance: async (attendanceId, playerId, data) => {
    try {
      const response = await apiClient.patch(`/attendance/${attendanceId}/player/${playerId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating player ${playerId} attendance:`, error);
      throw error;
    }
  },

  // Delete an attendance record
  deleteAttendance: async (id) => {
    try {
      const response = await apiClient.delete(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting attendance record ${id}:`, error);
      throw error;
    }
  }
}; 