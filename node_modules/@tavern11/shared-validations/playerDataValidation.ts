import { PlayerDataSchema } from '../schemas/playerData'; 
import { z } from 'zod';

export const validatePlayerData = (data: any) => {
  try {
    const playerData = PlayerDataSchema.parse(data);
    return { valid: true, data: playerData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.flatten() };
    }
    return { valid: false, error: 'Unexpected error during validation' };
  }
};
