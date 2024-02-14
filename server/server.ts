require('dotenv').config(); 
import express, { Request, Response } from 'express';
import * as fs from 'fs-extra';
import path from 'path';
import { PlayerData } from '../modules/sharedSchemas/playerData';
import { validatePlayerData } from '../modules/sharedValidations/playerDataValidation';


const app = express();
const PORT = 3000;
const { MessagingResponse } = require('twilio').twiml;
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.path}`);
  next();
});

const dbPath = path.join(__dirname, 'api', 'players.json');
const sessionsPath = path.join(__dirname, 'api', 'sessions.json');


// PASTE TWILIO CREDENTIALS HERE!!!
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// Twilio testing logic

// const testClient = require('twilio')(accountSid, authToken);
// testClient.messages
//   .create({
//     body: 'You installed Twilio node, you magnificent beast!',
//     to: '+13259982767', 
//     from: twilioNumber, 
//   })
//   .then((message: any) => console.log(message.sid));


// Sends player text when client clicks button 

const client = require('twilio')(accountSid, authToken, twilioNumber);

app.post('/api/send-text', (req: Request, res: Response) => {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const sessionData = JSON.parse(fs.readFileSync(sessionsPath, 'utf8'));
  const { playerName, phoneNumber } = req.body;
const gameDate = sessionData[sessionData.length -1];
  
if (!playerName || !phoneNumber) {
    return res.status(400).send('Missing player name or phone number');
  }
  const messageBody = `Hello, ${playerName}! you're invited to a D&D session on ${gameDate.month}/${gameDate.day}/${gameDate.year} Please reply 1 to confirm or 2 to decline.`;

  client.messages
    .create({
      body: messageBody,
      to: phoneNumber,  
      from: twilioNumber  
    })
    .then((message: any) => res.send(`Message sent! SID: ${message.sid}`))
    .catch((err: any) => res.status(500).send(err.message));
});

// Sends reply when player confirms or declines via text
app.post('/api/send-reply', (req: Request, res: Response) => {
  const userText: string = req.body.Body;
  const userNumber: string = req.body.From.replace(/^\+1/, '');
  const reply = new MessagingResponse();

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading players file", err);
      reply.message('Error processing your request.');
      return res.type('text/xml').send(reply.toString());
    }

    let players: { playerName: string; phoneNumber: string; isAttending?: boolean }[] = JSON.parse(data);
    const playerIndex = players.findIndex(p => p.phoneNumber === userNumber);

    if (playerIndex !== -1) {
      if (userText === "1") {
        players[playerIndex].isAttending = true;
        reply.message('Thank you for confirming');
      } else if (userText === "2") {
        players[playerIndex].isAttending = false;
        reply.message('Okay. Hope to see you next session!');
      } else {
        reply.message('Please respond with either 1 or 2. Responses must be a number');
        return res.type('text/xml').send(reply.toString());
      }

      fs.writeFile(dbPath, JSON.stringify(players, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error("Error writing updated players file", writeErr);
          reply.message('Error updating your attendance.');
          return res.type('text/xml').send(reply.toString());
        }

        res.type('text/xml').send(reply.toString());
      });
    } else {
      reply.message(`Your number is ${userNumber} and you said ${userText}. Is that correct?`);
      res.type('text/xml').send(reply.toString());
    }
  });
});


fs.ensureFileSync(dbPath);

function getNewId(data: PlayerData[]): number {
  if (data.length === 0) {
    return 1;
  }

  const maxId = data.reduce((max, p) => p.id > max ? p.id : max, data[0].id);
  return maxId + 1;
}

app.get("/", (req, res) => {
  res.send("Welcome to the Players API!");
}); 

app.patch('/api/players/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 
  if (status !== "Attending" && status !== "Not Attending") {
    return res.status(400).json({ message: 'Invalid status value. Must be true or false.' });
  } else {
    try {
      const data = await fs.readFile(dbPath, 'utf8');
      const players = JSON.parse(data);

      const playerIndex = players.findIndex((player: PlayerData) => player.id === parseInt(id, 10));
      if (playerIndex > -1) {
        players[playerIndex].isAttending = status === "Attending";

        await fs.writeFile(dbPath, JSON.stringify(players, null, 2), 'utf8');
        res.json({ message: `Player with ID ${id} updated successfully` });
      } else {
        res.status(404).json({ message: 'Player not found' });
      }
    } catch (error) {
      console.error('Error updating player status:', error);
      res.status(500).json({ message: 'Error updating player status' });
    }
  }
});


app.get('/api/players', async (req, res) => {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    res.json(JSON.parse(data));
  } catch(error) {
    console.error('Error fetching players');
    res.status(500).json({ message: 'Error fetching players' });
  }
});

app.patch('/api/players/:id', async (req, res) => {
  const { id } = req.params; // Get the id from URL params
  const { playerName, phoneNumber, isAttending, isInvited } = req.body;

  try {
    // Read current players data
    const data = await fs.readFile(dbPath, 'utf8');
    const players = JSON.parse(data);

    // Find and update the player
    const playerIndex = players.findIndex((player: any) => player.id === parseInt(id, 10));
    if (playerIndex > -1) {
      // For PATCH, only update fields provided in the request body
      const updatedPlayer = { ...players[playerIndex] };
      if (playerName !== undefined) updatedPlayer.playerName = playerName;
      if (phoneNumber !== undefined) updatedPlayer.phoneNumber = phoneNumber;
      if (isAttending !== undefined) updatedPlayer.isAttending = isAttending;
      if (isInvited !== undefined) updatedPlayer.isInvited = isInvited;

      players[playerIndex] = updatedPlayer;

      // Write the updated players back to the file
      await fs.writeFile(dbPath, JSON.stringify(players, null, 2), 'utf8');
      res.json({ message: 'Player updated successfully' });
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ message: 'Error updating player' });
  }
});

// add new player route
app.post("/api/players",  async (req: Request, res: Response) => {
  try {
    const data: PlayerData[] = await fs.readJson(dbPath, { throws: false }) || [];
    const newId = getNewId(data);

    const newPlayer = {
      id: newId,
      playerName: req.body.playerName,
      phoneNumber: req.body.phoneNumber
    };

    data.push(newPlayer);

    await fs.writeJson(dbPath, data);

    res.status(201).json(newPlayer);
  } catch (error) {
    console.error('Error processing request:', error instanceof Error ? error.message : error);
    if (!res.headersSent) { // Checks if the response was not yet sent
      res.status(500).json({ error: 'Error adding player' });
    }
  }
});

//Deletes player
app.delete('/api/players/:id', (req, res) => {
  const { id } = req.params; 

  const players = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  const updatedPlayers = players.filter((player: PlayerData) => player.id.toString() !== id);

  fs.writeFileSync(dbPath, JSON.stringify(updatedPlayers, null, 2));

  res.send({ success: true });
});
app.post('/api/sessions', (req, res) => {
const sessionData = req.body;

fs.readFile(sessionsPath, (err, data) => {
  if (err && err.code === 'ENOENT') {
    fs.writeFile(sessionsPath, JSON.stringify([sessionData]), () => {
      res.status(201).send('Session saved');
    });
  } else {
    const sessions = JSON.parse(data.toString());
    sessions.push(sessionData);
    fs.writeFile(sessionsPath, JSON.stringify(sessions), () => {
      res.status(201).send('Session saved');
    });
  }
});
});

app.get('/api/sessions', (req: Request, res: Response) => {
  
  fs.readFile(sessionsPath, (err, data) => {
    if (err) {
      console.error('Error reading sessions.json:', err);
      res.status(500).send('Error loading session data');
      return;
    }
    res.json(JSON.parse(data.toString()));
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
