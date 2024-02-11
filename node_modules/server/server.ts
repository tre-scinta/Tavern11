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

const dbPath = path.join(__dirname, 'players.json');

fs.ensureFileSync(dbPath);

function getNewId(data: PlayerData[]): number {
  if (data.length === 0) {
    return 1;
  }

  const maxId = data.reduce((max, p) => p.id > max ? p.id : max, data[0].id);
  return maxId + 1;
}

app.post('/api/players', validatePlayerData,  async (req: Request, res: Response) => {
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
    if (error instanceof Error) {
      console.error('Error processing request:', error.message);
      console.error(error.stack);
  } else {
      // Handle the case where error is not an instance of Error
      console.error('Error processing request:', error);
  }
  res.status(500).json({ error: 'Error adding player' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
