import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { PlayerData } from '../../modules/sharedSchemas/playerData';
import twilio from 'twilio';
import { MessagingResponse } from 'twilio/lib/twiml/MessagingResponse';
import { client, twilioNumber } from './twilioClient';

const dbPath = path.join(__dirname, '..', 'api', 'players.json');
const sessionsPath = path.join(__dirname, '..', 'api', 'sessions.json');

fs.ensureFileSync(dbPath);

function getNewId(data: PlayerData[]): number {
  if (data.length === 0) {
    return 1;
  }

  const maxId = data.reduce((max, p) => p.id > max ? p.id : max, data[0].id);
  return maxId + 1;
}

// Sends player text when client clicks button 
export const sendInvite=(req: Request, res: Response) => {
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
      .then((message: any) => res.json({message: `Message sent! SID: ${message.sid}`}))
      .catch((err: any) => res.status(500).json({error: err.message}));
  };
  
  // Sends reply when player confirms or declines via text
  export const sendReply= (req: Request, res: Response) => {
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
  };

  //Updates player's isAttending status
  export const updateIsAttending= async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isAttending } = req.body; 
    try {
      const data = await fs.readFile(dbPath, 'utf8');
      const players = JSON.parse(data);
      const playerIndex = players.findIndex((player: PlayerData) => player.id === parseInt(id, 10));
      if (playerIndex > -1) {
        players[playerIndex].isAttending = isAttending;
  
        await fs.writeFile(dbPath, JSON.stringify(players, null, 2), 'utf8');
        res.json({ message: `Player with ID ${id} updated successfully.` });
      } else {
        res.status(404).json({ message: 'Player not found.' });
      }
    } catch (error) {
      console.error('Error updating player status:', error);
      res.status(500).json({ message: 'Error updating player status.' });
    }
  };
  
  //Returns players
  export const fetchPlayers= async (req: Request, res: Response) => {
    try {
      const data = await fs.readFile(dbPath, 'utf8');
      res.json(JSON.parse(data));
    } catch(error) {
      console.error('Error fetching players');
      res.status(500).json({ message: 'Error fetching players' });
    }
  };
  
  //Updates player data when user edits player info
  export const editPlayer= async (req: Request, res: Response) => {
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
  };
  
  // add new player route
  export const addPlayer=  async (req: Request, res: Response) => {
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
  };
  
  //Deletes player
  export const deletePlayer= (req: Request, res: Response) => {
    const { id } = req.params; 
  
    const players = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
    const updatedPlayers = players.filter((player: PlayerData) => player.id.toString() !== id);
  
    fs.writeFileSync(dbPath, JSON.stringify(updatedPlayers, null, 2));
  
    res.send({ success: true });
  });
  