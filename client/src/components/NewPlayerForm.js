import React from 'react';

const NewPlayerForm = ({ newPlayer, setNewPlayer, handleAddPlayer }) => {
  return (
    <div id="addPlayer">
      <h2>Add New Player Here</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={newPlayer.playerName}
          placeholder='Enter new player name here'
          onChange={(e) => setNewPlayer({ ...newPlayer, playerName: e.target.value })}
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          value={newPlayer.phoneNumber}
          placeholder='Enter new phone number here'
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
        </select>
      </div>
      <div>
        <button onClick={handleAddPlayer}>Add Player</button>
      </div>
    </div>
  );
};

export default NewPlayerForm;