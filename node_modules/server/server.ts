import express, { Request, Response } from 'express';
import * as fs from 'fs-extra';
import path from 'path';
import { PlayerData } from '../modules/sharedSchemas/playerData';
import { validatePlayerData } from '../modules/sharedValidations/playerDataValidation';

const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.path}`);
  next();
});

const dbPath = path.join(__dirname, 'api', 'players.json');

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
