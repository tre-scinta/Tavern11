import { useCallback } from 'react';
import fetchJSON from '../utils/fetchJSON';

function useTextButton(players) {
  const handleTextButtonClick = useCallback(async (playerName, id) => {
    const playerToText = players.find(player => player.id === id);

    if (playerToText) {
      try {
        alert(`Sending text invitation to ${playerToText.playerName} with id number ${playerToText.id} at ${playerToText.phoneNumber}`);
        
        await fetchJSON(`/api/send-text`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(playerToText)
        });

        alert(`Invited ${playerName} by text message`);
      } catch (error) {
        alert(`Error sending a text to ${playerName} due to error: ${error}`);
      }
    } else {
      alert(`Player with id: ${id} not found`);
    }
  }, [players]); // Dependencies

  return handleTextButtonClick;
}
export default useTextButton;