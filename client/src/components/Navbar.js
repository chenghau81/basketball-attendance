import React from 'react';
import { Navbar as BSNavbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <BSNavbar bg="primary" variant="dark" expand="lg">
      <Container>
        <BSNavbar.Brand as={Link} to="/">Basketball Attendance Tracker</BSNavbar.Brand>
      </Container>
    </BSNavbar>
  );
};

export default Navbar; 