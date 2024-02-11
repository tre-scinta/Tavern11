import { z } from 'zod';

export const PlayerDataSchema = z.object({
  id: z.number(),
  playerName: z.string(),
  phoneNumber: z.string(),
  isInvited: z.boolean().optional(),
  isAttending: z.boolean().optional(),
});

// Export TypeScript type derived from Zod schema
export type PlayerData = z.infer<typeof PlayerDataSchema>;
