import { useCallback } from 'react';
import fetchJSON from '../utils/fetchJSON';

export default function useHandleStatusChange(setPlayers) {
  const handleStatusChange = useCallback(async (playerId, isAttending) => {
    // Attempt to update with optimistic UI update
    setPlayers(currentPlayers => {
      // Store the current state for potential rollback
      const previousPlayers = [...currentPlayers];
      
      // Return the updated state
      const updatedPlayers = currentPlayers.map(player =>
        player.id === playerId ? { ...player, isAttending: isAttending } : player
      );

      // Attach previous state for rollback in case of error
      updatedPlayers.previous = previousPlayers;
      return updatedPlayers;
    });

    try {
      await fetchJSON(`/api/players/${playerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAttending: isAttending }),
      });
    } catch (error) {
      // Revert to the previous state & notify user
      setPlayers(previousPlayers => previousPlayers.previous || previousPlayers);
      alert(`Failed to update the status due to error: ${error}. Please try again.`);
    }
  }, [setPlayers]); // Dependencies

  return handleStatusChange;
}