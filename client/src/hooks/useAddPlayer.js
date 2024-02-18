import { useCallback } from 'react';
import fetchJSON from '../utils/fetchJSON';


function useAddPlayer(setPlayers, newPlayer, setNewPlayer) {
  const handleAddPlayer = useCallback(async () => {
    if (newPlayer.playerName && newPlayer.phoneNumber) {
      try {
        const data = await fetchJSON("/api/players", {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(newPlayer),
        });
        alert(`${data.playerName} successfully added to the database!`);
        setPlayers(prevPlayers => [...prevPlayers, data]);
        setNewPlayer({ playerName: '', phoneNumber: '', status: 'Attending' });
      } catch (error) {
        alert('There was an error!');
      }
    } else {
      alert('Missing playerName or phoneNumber');
    }
  }, [setPlayers, newPlayer, setNewPlayer]); // Dependencies

  return handleAddPlayer;
}
export default useAddPlayer;