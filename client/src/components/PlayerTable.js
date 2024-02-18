import React from 'react';

const PlayerTable = ({
  players,
  editPlayer,
  handleSaveClick,
  handleCancelClick,
  handleEditClick,
  handleChange,
  handleStatusChange,
  handleDeleteClick,
  handleTextButtonClick
}) => {
  return (
    <div id="playerTable">
      <h2>Current Players</h2>
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
          {players && players.map((player) => (
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
                  onChange={(e) => handleStatusChange(player.id, e.target.value === "Attending")}
                >
                  <option value="Attending">Attending</option>
                  <option value="Not Attending">Not Attending</option>
                </select>
              </td>
              <td>
                {editPlayer && editPlayer.id === player.id ? (
                  <>
                    <button onClick={() => handleDeleteClick(player.id)}>Delete</button>
                    <button onClick={() => handleSaveClick(player.id)}>Save</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleTextButtonClick(player.playerName, player.id)}>
                      Invite
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;