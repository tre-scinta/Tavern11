import React from 'react';

const SessionDisplay = ({ recentSession, showSessionForm, dateInput, handleShowSessionForm, setDateInput, setShowSessionForm, setSessionDate }) => {
  return (
    <div id="sessionDisplay">
      <h2>Session Info</h2>
      {Object.keys(recentSession).length > 0 ? (
        <h4>Scheduled Session: {`${recentSession.month}/${recentSession.day}/${recentSession.year}`}</h4>
      ) : (
        <h4>Loading or no sessions available...</h4>
      )}
      <button id="addSessionBtn" onClick={handleShowSessionForm}>Add new session</button>
      {showSessionForm && (
        <div id="sessionForm">
          {/* Start of form */}
          <form onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission behavior
            setSessionDate(dateInput); // Pass the dateInput state directly
          }}>
            <label htmlFor="dateInput">Date (MM/DD/YYYY):</label>
            <input
              type="text"
              id="dateInput"
              placeholder="MM/DD/YYYY"
              value={dateInput} 
              onChange={(e) => setDateInput(e.target.value)}
            />
            <button type="button" onClick={() => setShowSessionForm(false)}>Cancel</button>
            <button type="submit">Save Date</button>
          </form>
          {/* End of form */}
        </div>
      )}
    </div>
  );
};

export default SessionDisplay;