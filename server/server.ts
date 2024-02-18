require('dotenv').config(); 
import express, { Request, Response } from 'express';
import { addSession, getSessions } from './controllers/sessionController';
import { addPlayer, fetchPlayers, editPlayer, deletePlayer, updateIsAttending, sendInvite, sendReply } from './controllers/playerController';


const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.path}`);
  next();
});

//Welcome page 
app.get("/", (req, res) =>{ 
  res.send("Welcome to the Players API!");
});

  //Player CRUD functions

  app.post("/api/players", addPlayer);
  app.delete('/api/players/:id', deletePlayer);
  app.patch('/api/players/:id/status', updateIsAttending);
app.get('/api/players', fetchPlayers);
app.patch('/api/players/:id', editPlayer);  

//Text player functions
app.post('/api/send-text',  sendInvite);
app.post('/api/send-reply', sendReply);

//Sessions routes
app.post('/api/sessions', addSession);
app.get('/api/sessions', getSessions);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});