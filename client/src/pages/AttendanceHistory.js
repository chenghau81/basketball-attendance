import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal } from 'react-bootstrap';
import { attendanceAPI } from '../utils/api';
import { format } from 'date-fns';
import { FaEye, FaTrash } from 'react-icons/fa';

const AttendanceHistory = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    try {
      const data = await attendanceAPI.getAllAttendance();
      setAttendanceRecords(data);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await attendanceAPI.deleteAttendance(id);
        fetchAttendanceRecords(); // Refresh the list
      } catch (error) {
        console.error('Error deleting attendance record:', error);
        alert('Failed to delete attendance record. Please try again.');
      }
    }
  };

  const viewSessionDetails = (session) => {
    setSelectedSession(session);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSession(null);
  };

  const getAttendanceRate = (session) => {
    if (!session || !session.players || session.players.length === 0) return 0;
    const presentCount = session.players.filter(p => p.present).length;
    return (presentCount / session.players.length) * 100;
  };

  return (
    <div>
      <h2 className="mb-4">Attendance History</h2>
      
      <Card>
        <Card.Header>All Training Sessions</Card.Header>
        <Card.Body>
          {loading ? (
            <p>Loading...</p>
          ) : attendanceRecords.length > 0 ? (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Attendance Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map(record => {
                  const presentCount = record.players.filter(p => p.present).length;
                  const absentCount = record.players.length - presentCount;
                  const rate = getAttendanceRate(record);
                  
                  return (
                    <tr key={record._id}>
                      <td>
                        {format(new Date(record.sessionDate), 'EEEE, MMMM d, yyyy')}
                      </td>
                      <td>
                        <Badge bg="success">{presentCount}</Badge>
                      </td>
                      <td>
                        <Badge bg="danger">{absentCount}</Badge>
                      </td>
                      <td>
                        <div className="progress">
                          <div 
                            className="progress-bar bg-success" 
                            role="progressbar" 
                            style={{ width: `${rate}%` }}
                            aria-valuenow={rate.toFixed(0)} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                          >
                            {rate.toFixed(0)}%
                          </div>
                        </div>
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => viewSessionDetails(record)}
                        >
                          <FaEye /> View
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteRecord(record._id)}
                        >
                          <FaTrash /> Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <p>No attendance records found.</p>
          )}
        </Card.Body>
      </Card>
      
      {/* Session Details Modal */}
      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Session Details: {selectedSession && format(new Date(selectedSession.sessionDate), 'EEEE, MMMM d, yyyy')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSession && (
            <>
              {selectedSession.notes && (
                <div className="mb-4">
                  <h5>Notes:</h5>
                  <p>{selectedSession.notes}</p>
                </div>
              )}
              
              <h5>Attendance:</h5>
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSession.players.map(item => (
                    <tr key={item.player._id} className={item.present ? 'present' : 'absent'}>
                      <td>{item.player.name}</td>
                      <td>{item.player.email}</td>
                      <td>
                        {item.present ? (
                          <Badge bg="success">Present</Badge>
                        ) : (
                          <Badge bg="danger">Absent</Badge>
                        )}
                      </td>
                      <td>{item.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AttendanceHistory; 