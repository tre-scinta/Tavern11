import React, { useState, useEffect } from 'react';

//Custom hooks
import useAPI from './hooks/useAPI'; 
import useFetchAtInterval from './hooks/useFetchAtInterval'; 
import useHandleStatusChange from './hooks/useHandleStatusChange';
import useTextButton from './hooks/useTextButton';
import useAddPlayer from './hooks/useAddPlayer';
import useSavePlayer from './hooks/useSavePlayer';
import useDeletePlayer from './hooks/useDeletePlayer';
import useNewSession from './hooks/useNewSession';
import useFormState from './hooks/useFormState';

//Utility functions
import fetchJSON from './utils/fetchJSON'; 

import initialPlayers from './constants/initialPlayers'; //Constants
//Components
import Header from './components/Header';
import SessionDisplay from './components/SessionDisplay';
import PlayerTable from './components/PlayerTable';
import NewPlayerForm from './components/NewPlayerForm';
import './App.css';

const App = () => {
  const [players, setPlayers] = useAPI(`/api/players`, null, []);
  const [sessions, setSessions] = useAPI('/api/sessions', null, []);
  const [recentSession, setRecentSession] = useState({});
const [showSessionForm, setShowSessionForm] = useState(false);
const [newPlayer, setNewPlayer] = useState({ id: '', playerName: '', phoneNumber: '', status: true });
const [editPlayer, handleChange, setEditPlayer] = useFormState({
  id: '', playerName: '', phoneNumber: '', status: true
});

const [dateInput, setDateInput] = useState('');
const handleEditClick = (player) => {setEditPlayer(player); };
const handleCancelClick = () => {setEditPlayer(false); };
const handleShowSessionForm = () => {setShowSessionForm(true); };

const fetchedSessions = useFetchAtInterval('/api/sessions', 5000);
const fetchedPlayers = useFetchAtInterval('/api/players', 5000);


useEffect(() => {
    console.log("All sessions: ", sessions); 
    if (sessions) {
      const recent = sessions[sessions.length - 1];
      console.log("Most recent session: ", recent); // Log the most recent session
      // Update session
      setRecentSession(sessions[sessions.length - 1]);
    }
  }, [sessions]); // Re-run effect upon dependency change


const handleStatusChange = useHandleStatusChange(setPlayers);
const handleTextButtonClick = useTextButton(players);
const handleAddPlayer = useAddPlayer(setPlayers, newPlayer, setNewPlayer);
const handleDeleteClick = useDeletePlayer(setPlayers);
const handleSaveClick = useSavePlayer(players, setPlayers, editPlayer, setEditPlayer);
const setSessionDate = useNewSession(setSessions, setDateInput, setShowSessionForm);

return (
  <div className="App">
  <Header />
  <SessionDisplay
    recentSession={recentSession}
    showSessionForm={showSessionForm}
    dateInput={dateInput}
    handleShowSessionForm={handleShowSessionForm}
    setDateInput={setDateInput}
    setShowSessionForm={setShowSessionForm}
    setSessionDate={setSessionDate}
  />
  <PlayerTable
    players={players}
    editPlayer={editPlayer}
    handleSaveClick={handleSaveClick}
    handleCancelClick={handleCancelClick}
    handleEditClick={(player) => setEditPlayer(player)} 
    handleChange={handleChange}
    handleStatusChange={handleStatusChange}
    handleDeleteClick={handleDeleteClick}
    handleTextButtonClick={handleTextButtonClick}
  />
  <NewPlayerForm
    newPlayer={newPlayer}
    setNewPlayer={setNewPlayer}
    handleAddPlayer={handleAddPlayer}
  />
</div>
);
  }
  export default App;