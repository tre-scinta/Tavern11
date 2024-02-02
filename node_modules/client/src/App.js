import React, { useState } from 'react';
import './App.css';

const initialPlayers = [
  { id: 1, playerName: 'Player 1', phoneNumber: '123-456-7890', status: 'Attending' },
  { id: 2, playerName: 'Player 2', phoneNumber: '987-654-3210', status: 'Not Attending' },
  // Adding initial players for test purposes 
];

const App = () => {
  const [players, setPlayers] = useState(initialPlayers);
  const [newPlayer, setNewPlayer] = useState({ playerName: '', phoneNumber: '', status: 'Attending' });
  const [editMode, setEditMode] = useState(null); // Store the ID of the player being edited

  const handleTextButtonClick = (playerName) => {
    // Add SMS logic here 
    alert(`Sending a text to ${playerName}`);
  };

  const handleAddPlayer = () => {
    if (newPlayer.playerName && newPlayer.phoneNumber) {
      setPlayers((prevPlayers) => [
        ...prevPlayers,
        { id: prevPlayers.length + 1, ...newPlayer },
      ]);
      setNewPlayer({ playerName: '', phoneNumber: '', status: 'Attending' });
    }
  };

  const handleEditClick = (id) => {
    setEditMode(id);
  };

  const handleSaveClick = () => {
    setEditMode(null);
    // Implement saving logic if needed
  };

  const handleCancelClick = () => {
    setEditMode(null);
    // Implement canceling logic if needed
  };

  return (
    <div className="App">
      <h1>Tavern11</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>
                {editMode === player.id ? (
                  <input
                    type="text"
                    value={player.playerName}
                    onChange={(e) => {/* Implement onChange logic if needed */}}
                  />
                ) : (
                  player.playerName
                )}
              </td>
              <td>
                {editMode === player.id ? (
                  <input
                    type="text"
                    value={player.phoneNumber}
                    onChange={(e) => {/* Implement onChange logic if needed */}}
                  />
                ) : (
                  player.phoneNumber
                )}
              </td>
              <td>
                {editMode === player.id ? (
                  <select
                    value={player.status}
                    onChange={(e) => {/* Implement onChange logic if needed */}}
                  >
                    <option value="Attending">Attending</option>
                    <option value="Not Attending">Not Attending</option>
                    {/* Add more options as needed */}
                  </select>
                ) : (
                  player.status
                )}
              </td>
              <td>
                {editMode === player.id ? (
                  <>
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleTextButtonClick(player.playerName)}>
                    Send Text
                  </button>
                )}
                {!editMode && (
                  <button onClick={() => handleEditClick(player.id)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={newPlayer.playerName}
          aria-placeholder='Enter new player name here'
          onChange={(e) => setNewPlayer({ ...newPlayer, playerName: e.target.value })}
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          value={newPlayer.phoneNumber}
          aria-placeholder='Enter new phone number here'
          onChange={(e) => setNewPlayer({ ...newPlayer, phoneNumber: e.target.value })}
        />
      </div>
      <div>
        <label>Status:</label>
        <select
          value={newPlayer.status}
          onChange={(e) => setNewPlayer({ ...newPlayer, status: e.target.value })}
        >
          <option value="Attending">Attending</option>
          <option value="Not Attending">Not Attending</option>
          <option>Not Responded</option>
          <option> Not Yet Invited </option>
        </select>
      </div>
      <div>
        <button onClick={handleAddPlayer}>Add Player</button>
      </div>
    </div>
  );
};

export default App;
