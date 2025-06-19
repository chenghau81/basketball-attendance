import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Row, Col, Alert, Badge } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { playerAPI, attendanceAPI } from '../utils/api';
import { format } from 'date-fns';
import { FaCheck, FaTimes, FaSave } from 'react-icons/fa';

const TakeAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [players, setPlayers] = useState([]);
  const [attendanceRecord, setAttendanceRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  const fetchData = async (date) => {
    setLoading(true);
    try {
      // Get all active players
      const playersData = await playerAPI.getPlayers();
      const activePlayers = playersData.filter(player => player.active);
      setPlayers(activePlayers);
      
      // Try to get attendance record for the date
      const attendance = await attendanceAPI.getAttendanceByDate(date);
      
      if (attendance) {
        setAttendanceRecord(attendance);
      } else {
        // No record exists for this date
        setAttendanceRecord(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setAlert({
        show: true,
        message: 'Error loading data. Please try again.',
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const createAttendanceRecord = async () => {
    try {
      setSaving(true);
      const newRecord = await attendanceAPI.createAttendance({
        sessionDate: selectedDate
      });
      setAttendanceRecord(newRecord);
      setAlert({
        show: true,
        message: 'Created new attendance record for today.',
        type: 'success'
      });
    } catch (error) {
      console.error('Error creating attendance record:', error);
      setAlert({
        show: true,
        message: 'Error creating attendance record.',
        type: 'danger'
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleAttendance = async (playerId, currentStatus) => {
    try {
      // If no attendance record exists, create one
      if (!attendanceRecord) {
        await createAttendanceRecord();
        return;
      }
      
      const updatedStatus = !currentStatus;
      
      await attendanceAPI.updatePlayerAttendance(
        attendanceRecord._id,
        playerId,
        { present: updatedStatus }
      );
      
      // Update local state
      setAttendanceRecord(prevRecord => {
        const newRecord = { ...prevRecord };
        const playerIndex = newRecord.players.findIndex(
          p => p.player._id === playerId || p.player === playerId
        );
        
        if (playerIndex !== -1) {
          newRecord.players[playerIndex].present = updatedStatus;
        }
        
        return newRecord;
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      setAlert({
        show: true,
        message: 'Error updating attendance.',
        type: 'danger'
      });
    }
  };

  const isPlayerPresent = (playerId) => {
    if (!attendanceRecord) return false;
    
    const playerRecord = attendanceRecord.players.find(
      p => (p.player._id === playerId || p.player === playerId)
    );
    
    return playerRecord ? playerRecord.present : false;
  };
  
  const getAttendanceStats = () => {
    if (!attendanceRecord) return { present: 0, total: players.length };
    
    const presentCount = attendanceRecord.players.filter(p => p.present).length;
    return { present: presentCount, total: attendanceRecord.players.length };
  };

  const stats = getAttendanceStats();

  return (
    <div>
      <h2 className="mb-4">Take Attendance</h2>
      
      {alert.show && (
        <Alert 
          variant={alert.type} 
          dismissible 
          onClose={() => setAlert({ ...alert, show: false })}
        >
          {alert.message}
        </Alert>
      )}
      
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Session Date</Form.Label>
                <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  className="form-control"
                  dateFormat="EEEE, MMMM d, yyyy"
                />
              </Form.Group>
            </Col>
            <Col md={6} className="text-md-end">
              {!attendanceRecord && (
                <Button 
                  variant="primary" 
                  disabled={loading || saving}
                  onClick={createAttendanceRecord}
                >
                  <FaSave className="me-2" />
                  Create Attendance Sheet
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>
            Attendance for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </span>
          <span className="attendance-count">
            {stats.present} of {stats.total} players present
          </span>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.length > 0 ? (
                  players.map(player => {
                    const isPresent = isPlayerPresent(player._id);
                    return (
                      <tr key={player._id} className={isPresent ? 'present' : ''}>
                        <td>{player.name}</td>
                        <td>{player.email}</td>
                        <td>
                          {isPresent ? (
                            <Badge bg="success">Present</Badge>
                          ) : (
                            <Badge bg="danger">Absent</Badge>
                          )}
                        </td>
                        <td>
                          <Button
                            variant={isPresent ? "outline-danger" : "outline-success"}
                            size="sm"
                            onClick={() => toggleAttendance(player._id, isPresent)}
                            disabled={saving || (!attendanceRecord && !isPresent)}
                          >
                            {isPresent ? (
                              <>
                                <FaTimes className="me-1" /> Mark Absent
                              </>
                            ) : (
                              <>
                                <FaCheck className="me-1" /> Mark Present
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No players found. Add players first.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TakeAttendance; 