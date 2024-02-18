import { useCallback } from 'react';
import fetchJSON from '../utils/fetchJSON';

function useDeletePlayer(setPlayers) {
  const handleDeleteClick = useCallback(async (id) => {
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this player?')) {
      return;
    }

    try {
      await fetchJSON(`/api/players/${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
      });

      // State Management & Cleanup
      setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== id));
    } catch (error) {
      // Notify user of error
      alert(`Failed to delete player with following error: ${error.message}`);
    }
  }, [setPlayers]); // Dependency

  return handleDeleteClick;
}
export default useDeletePlayer;