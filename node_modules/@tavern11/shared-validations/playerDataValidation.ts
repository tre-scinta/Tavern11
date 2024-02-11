import { Request, Response, NextFunction } from 'express';
import { PlayerDataSchema } from '../sharedSchemas/playerData';
import { ZodError } from 'zod';

export function validatePlayerData(req: Request, res: Response, next: NextFunction): void {
  try {
    PlayerDataSchema.parse(req.body);
    next();  
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      // Handle unexpected errors differently
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
}
