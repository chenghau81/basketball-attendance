import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TakeAttendance from './pages/TakeAttendance';
import PlayerManagement from './pages/PlayerManagement';
import AttendanceHistory from './pages/AttendanceHistory';

const App = () => {
  return (
    <div className="app-container">
      <Navbar />
      <Container fluid className="p-0">
        <Row className="g-0">
          <Col md={2}>
            <Sidebar />
          </Col>
          <Col md={10} className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/take-attendance" element={<TakeAttendance />} />
              <Route path="/attendance-history" element={<AttendanceHistory />} />
              <Route path="/players" element={<PlayerManagement />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App; 