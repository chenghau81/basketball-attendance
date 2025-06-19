import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserCheck, FaHistory, FaUsers } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="sidebar p-3">
      <h5 className="mb-4">Menu</h5>
      <Nav className="flex-column">
        <Nav.Link 
          as={Link} 
          to="/" 
          active={location.pathname === '/'}
          className="d-flex align-items-center"
        >
          <FaHome className="me-2" /> Dashboard
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/take-attendance" 
          active={location.pathname === '/take-attendance'}
          className="d-flex align-items-center"
        >
          <FaUserCheck className="me-2" /> Take Attendance
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/attendance-history" 
          active={location.pathname === '/attendance-history'}
          className="d-flex align-items-center"
        >
          <FaHistory className="me-2" /> Attendance History
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/players" 
          active={location.pathname === '/players'}
          className="d-flex align-items-center"
        >
          <FaUsers className="me-2" /> Player Management
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar; 