import { userRoutes } from './routes/users';
import { pairingRoutes } from './routes/pairings';
import { HistorySchema } from './schemas/winner';
import { UserSchema } from './schemas/user';
import { PairingSchema } from './schemas/pairing';
import { z } from 'zod';

export const router = {
  ...userRoutes,
  ...pairingRoutes,
};

export type Router = typeof router;
export type History = z.infer<typeof HistorySchema>;
export type User = z.infer<typeof UserSchema>;
export type Pairing = z.infer<typeof PairingSchema>;
