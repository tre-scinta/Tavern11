import { useCallback } from 'react';
import fetchJSON from '../utils/fetchJSON';


function useSavePlayer(players, setPlayers, editPlayer, setEditPlayer) {
  const handleSaveClick = useCallback(async (id) => {
    const playerToUpdate = players.find(player => player.id === id);
    
    if (playerToUpdate && editPlayer) {
      const updatedData = { ...playerToUpdate, ...editPlayer };
      try {
        await fetchJSON(`/api/players/${id}`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(updatedData),
        });
        // State Management & Cleanup
        setPlayers(players.map(player => player.id === id ? updatedData : player));
        setEditPlayer(null);
      } catch (error) {
        // Notify user of error
        alert(`An error occurred while updating: ${error.message}`);
      }
    }
  }, [players, setPlayers, editPlayer, setEditPlayer]); // Dependencies

  return handleSaveClick;
}
export default useSavePlayer;