import React, { useState, useEffect } from 'react';
import './App.css';

const initialPlayers = [
  { id: 1, playerName: 'Player 1', phoneNumber: '123-456-7890', status: 'Attending' },
  { id: 2, playerName: 'Player 2', phoneNumber: '987-654-3210', status: 'Not Attending' },
  // Adding initial players for test purposes 
];

const App = () => {
  const [players, setPlayers] = useState(initialPlayers);
  const [newPlayer, setNewPlayer] = useState({ id: '', playerName: '', phoneNumber: '', status: 'Attending' });
const [editPlayer, setEditPlayer] = useState(null);

useEffect(() => {
  fetch('/api/players')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setPlayers(data);
    })
    .catch(error => {
      console.error('There was an error fetching players:', error);
    });
}, []);

const handleStatusChange = (playerId, newStatus) => {
  setPlayers(players.map(player => {
    if (player.id === playerId) {
      return { ...player, status: newStatus };
    }
    return player;
  }));

  fetch(`/api/players/${playerId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: newStatus }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Status updated successfully', data);
  })
  .catch(error => {
    console.error('Error updating status:', error);
  });
};

const handleTextButtonClick = (playerName) => {
    // Add SMS logic here 
    alert(`Sending a text to ${playerName}`);
  };
  
  const handleAddPlayer = () => { 
    if (newPlayer.playerName && newPlayer.phoneNumber) {
      fetch("/api/players", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',          
        },
        body: JSON.stringify(newPlayer),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        alert(`${data.playerName} added to database with ID: ${data.id}`); 
        setPlayers(prevPlayers => [...prevPlayers, data]);
      })
      .then(() => {
        setNewPlayer({ playerName: '', phoneNumber: '', status: 'Attending' });
      })
      .catch(error => {
        console.error('There was an error!', error);
        alert('There was an error!'); 
      });
    } else {
      console.error('Missing playerName or phoneNumber');
      alert('Missing playerName or phoneNumber');
    }
  };
  const handleEditClick = (player) => {
    setEditPlayer(player );
  };

  const handleSaveClick = (id) => {
    const playerToUpdate = players.find(player => player.id === id);
    
    if (playerToUpdate) {
      const updatedData = { ...playerToUpdate, ...editPlayer };
  
      fetch(`/api/players/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        setPlayers(players.map(player => player.id === id ? updatedData : player));
      })
      .catch(error => {
        console.error('Error updating player:', error);
      });
    }
  
    setEditPlayer(null);
  };
  

  const handleCancelClick = () => {
    setEditPlayer(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditPlayer(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="App">
      <h1>Tavern11</h1>
      <table>
        <thead>
          <tr>
            <th>Edit</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Send SMS Invite</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
                    <td>
        {editPlayer && editPlayer.id === player.id ? (
          <>
            <button onClick={() => handleSaveClick(player.id)}>Save</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => handleEditClick(player)}>Edit</button>
          </>
        )}
      </td>
              <td>
                {editPlayer && editPlayer.id === player.id ? (
                  <input
                    type="text"
                    name="playerName"
                    value={editPlayer.playerName}
                    onChange={handleChange}
                  />
                ) : (
                  player.playerName
                )}
              </td>
              <td>
                {editPlayer && editPlayer.id === player.id ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editPlayer.phoneNumber}
                    onChange={handleChange}
                  />
                ) : (
                  player.phoneNumber
                )}
              </td>
              <td>
                  <select
                    name="status"
                    value={player.isAttending ? "Attending" : "Not Attending"}
                    onChange={(e) => handleStatusChange(player.id, e.target.value)}
                  >
                    <option value="Attending">Attending</option>
                    <option value="Not Attending">Not Attending</option>
                  </select>
              </td>
              <td>
                {editPlayer && editPlayer.id  === player.id ? (
                  <>
                    <button onClick={() => handleSaveClick(player.id)}>Save</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleTextButtonClick(player.playerName)}>
                      Invite
                    </button>
                  </>
                )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Add New Player Here</h2>
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
  }
export default App;