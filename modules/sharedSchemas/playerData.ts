import { z } from 'zod';

export const PlayerDataSchema = z.object({
  playerName: z.string(),
  playerNumber: z.string(),
  isInvited: z.boolean().optional(),
  isAttending: z.boolean().optional(),
});
