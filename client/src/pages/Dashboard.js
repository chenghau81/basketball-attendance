import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup, Badge, Table, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { playerAPI, attendanceAPI } from '../utils/api';
import { format } from 'date-fns';

const Dashboard = () => {
  const [playerStats, setPlayerStats] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [stats, setStats] = useState({
    totalPlayers: 0,
    activePlayers: 0,
    sessionsHeld: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch players
        const playersData = await playerAPI.getPlayers();
        
        // Calculate basic stats even if other API calls fail
        setStats(prevStats => ({
          ...prevStats,
          totalPlayers: playersData.length,
          activePlayers: playersData.filter(player => player.active).length
        }));

        try {
          // Fetch player attendance statistics separately to isolate errors
          const playerStatsData = await playerAPI.getPlayerStats();
          console.log('Dashboard received player stats:', playerStatsData);
          setPlayerStats(playerStatsData);
        } catch (statsError) {
          console.error('Error fetching player stats:', statsError);
          setError('Failed to load player statistics. Please check the server logs.');
        }

        try {
          // Fetch attendance records separately to isolate errors
          const attendanceData = await attendanceAPI.getAllAttendance();
          
          // Get recent sessions
          const recent = attendanceData.slice(0, 5); // Get most recent 5
          setRecentSessions(recent);
          
          // Update session count
          setStats(prevStats => ({
            ...prevStats,
            sessionsHeld: attendanceData.length
          }));
        } catch (attendanceError) {
          console.error('Error fetching attendance data:', attendanceError);
          setError('Failed to load attendance history. Please check the server logs.');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('An error occurred while loading the dashboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Stats Cards */}
          <Row className="mb-4">
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Total Players</Card.Title>
                  <Card.Text className="fs-1 text-center">{stats.totalPlayers}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Active Players</Card.Title>
                  <Card.Text className="fs-1 text-center">{stats.activePlayers}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Sessions Held</Card.Title>
                  <Card.Text className="fs-1 text-center">{stats.sessionsHeld}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Player Attendance Stats */}
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header>Player Attendance Statistics</Card.Header>
                <Card.Body>
                  {playerStats && playerStats.length > 0 ? (
                    <Table responsive striped bordered hover>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Sessions Attended</th>
                          <th>Total Sessions</th>
                          <th>Attendance Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerStats
                          .filter(player => player.active)
                          .sort((a, b) => b.attendancePercentage - a.attendancePercentage)
                          .map(player => (
                            <tr key={player._id}>
                              <td>{player.name}</td>
                              <td>{player.sessionsPresent}</td>
                              <td>{player.totalSessions}</td>
                              <td>
                                <Badge bg={getAttendanceColor(player.attendancePercentage)}>
                                  {player.attendancePercentage}%
                                </Badge>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-center">No player attendance data available</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Sessions */}
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header>Recent Training Sessions</Card.Header>
                <ListGroup variant="flush">
                  {recentSessions.length > 0 ? (
                    recentSessions.map(session => {
                      const presentCount = session.players.filter(p => p.present).length;
                      return (
                        <ListGroup.Item key={session._id} className="d-flex justify-content-between align-items-center">
                          <div>
                            {format(new Date(session.sessionDate), 'EEEE, MMMM d, yyyy')}
                          </div>
                          <div>
                            <Badge bg="success">{presentCount} present</Badge>
                          </div>
                        </ListGroup.Item>
                      );
                    })
                  ) : (
                    <ListGroup.Item>No sessions recorded yet</ListGroup.Item>
                  )}
                </ListGroup>
                <Card.Footer>
                  <Link to="/attendance-history">View all sessions</Link>
                </Card.Footer>
              </Card>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Row>
            <Col>
              <Card>
                <Card.Header>Quick Actions</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item action as={Link} to="/take-attendance">
                    Take Today's Attendance
                  </ListGroup.Item>
                  <ListGroup.Item action as={Link} to="/players">
                    Manage Players
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

// Helper function to determine badge color based on attendance percentage
const getAttendanceColor = (percentage) => {
  if (percentage >= 80) return 'success';
  if (percentage >= 60) return 'info';
  if (percentage >= 40) return 'warning';
  return 'danger';
};

export default Dashboard; 