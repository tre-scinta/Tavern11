import fs from 'fs-extra';
import path from 'path';

const sessionsPath = path.join(__dirname, '..', 'api', 'sessions.json');

//Adds new session
export const addSession = (req: Request, res: Response) => {
    const sessionData = req.body;
    
    fs.readFile(sessionsPath, (err, data) => {
      if (err && err.code === 'ENOENT') {
        fs.writeFile(sessionsPath, JSON.stringify([sessionData]), () => {
          res.status(201).json({message: 'Session saved'});
        });
      } else {
        const sessions = JSON.parse(data.toString());
        sessions.push(sessionData);
        fs.writeFile(sessionsPath, JSON.stringify(sessions), () => {
          res.status(201).json(sessionData);
        });
      }
    });
    };
    
    //Returns sessions
    export const getSessions = (req: Request, res: Response) => {
      
      fs.readFile(sessionsPath, (err, data) => {
        if (err) {
          console.error('Error reading sessions.json:', err);
          res.status(500).send('Error loading session data');
          return;
        }
        res.json(JSON.parse(data.toString()));
      });
    };
    