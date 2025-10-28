import { z } from 'zod';
import { UserSchema } from './user';

export const PairingSchema = z.object({
  user1: UserSchema,
  user2: UserSchema,
  timestamp: z.string(),
});

export type Pairing = z.infer<typeof PairingSchema>;
