import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert, Badge } from 'react-bootstrap';
import { playerAPI } from '../utils/api';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    active: true
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const data = await playerAPI.getPlayers();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
      setAlert({
        show: true,
        message: 'Error loading players. Please try again.',
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      active: true
    });
    setEditingPlayer(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      email: player.email,
      phone: player.phone || '',
      active: player.active
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPlayer) {
        // Update player
        await playerAPI.updatePlayer(editingPlayer._id, formData);
        setAlert({
          show: true,
          message: 'Player updated successfully!',
          type: 'success'
        });
      } else {
        // Create new player
        await playerAPI.createPlayer(formData);
        setAlert({
          show: true,
          message: 'Player added successfully!',
          type: 'success'
        });
      }
      
      closeModal();
      fetchPlayers(); // Refresh player list
    } catch (error) {
      console.error('Error saving player:', error);
      setAlert({
        show: true,
        message: `Error ${editingPlayer ? 'updating' : 'adding'} player. Please try again.`,
        type: 'danger'
      });
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await playerAPI.deletePlayer(playerId);
        fetchPlayers(); // Refresh player list
        setAlert({
          show: true,
          message: 'Player deleted successfully!',
          type: 'success'
        });
      } catch (error) {
        console.error('Error deleting player:', error);
        setAlert({
          show: true,
          message: 'Error deleting player. Please try again.',
          type: 'danger'
        });
      }
    }
  };

  const toggleActiveStatus = async (player) => {
    try {
      await playerAPI.updatePlayer(player._id, { 
        active: !player.active 
      });
      fetchPlayers(); // Refresh player list
      setAlert({
        show: true,
        message: `Player ${player.active ? 'deactivated' : 'activated'} successfully!`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating player status:', error);
      setAlert({
        show: true,
        message: 'Error updating player status. Please try again.',
        type: 'danger'
      });
    }
  };

  return (
    <div>
      <h2 className="mb-4">Player Management</h2>
      
      {alert.show && (
        <Alert 
          variant={alert.type} 
          dismissible 
          onClose={() => setAlert({ ...alert, show: false })}
        >
          {alert.message}
        </Alert>
      )}
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>All Players</span>
          <Button variant="primary" onClick={openAddModal}>
            <FaUserPlus className="me-2" />
            Add Player
          </Button>
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
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.length > 0 ? (
                  players.map(player => (
                    <tr key={player._id}>
                      <td>{player.name}</td>
                      <td>{player.email}</td>
                      <td>{player.phone || "-"}</td>
                      <td>
                        <Badge bg={player.active ? 'success' : 'danger'}>
                          {player.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => openEditModal(player)}
                        >
                          <FaEdit /> Edit
                        </Button>
                        <Button
                          variant={player.active ? "outline-warning" : "outline-success"}
                          size="sm"
                          className="me-2"
                          onClick={() => toggleActiveStatus(player)}
                        >
                          {player.active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeletePlayer(player._id)}
                        >
                          <FaTrash /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No players found.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      
      {/* Add/Edit Player Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingPlayer ? 'Edit Player' : 'Add New Player'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Phone (optional)</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingPlayer ? 'Update' : 'Add'} Player
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PlayerManagement; 