import { userRoutes } from './routes/users';
import { pairingRoutes } from './routes/pairings';

export const router = {
  ...userRoutes,
  ...pairingRoutes,
};

export type Router = typeof router;
