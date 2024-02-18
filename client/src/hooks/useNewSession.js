import { useCallback } from 'react';
import fetchJSON from '../utils/fetchJSON';


function useNewSession(setSessions, setDateInput, setShowSessionForm) {
  const setSessionDate = useCallback(async (dateInput) => {
    alert(`Submitting dateInput: ${dateInput}`);
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(20\d\d)$/;
    if (!regex.test(dateInput)) {
      alert('Please enter a valid date in MM/DD/YYYY format.');
      return;
    }

    const [month, day, year] = dateInput.split('/').map(num => parseInt(num, 10));

    try {
      const newSession = await fetchJSON('/api/sessions', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ month, day, year }),
      });
      console.log(`Server response: ${JSON.stringify(newSession)}`);
      // State management and cleanup
      setSessions(prevSessions => [...prevSessions, newSession]);
      setDateInput('');
      setShowSessionForm(false);

      // Notify user
      alert(`New session added for ${month}/${day}/${year}`);
    } catch (error) {
      alert(`Failed due to error: ${error}`);
    }
  }, [setSessions, setDateInput, setShowSessionForm]); // Dependencies

  return setSessionDate;
}
export default useNewSession;