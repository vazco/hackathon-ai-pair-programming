import { os } from '@orpc/server';
import { UsersArraySchema } from '@/types/user';
import { PairingSchema } from '@/types/pairing';
import { getActiveUsers, generateRandomPairing } from '@/services/users';

const healthProcedure = os.handler(() => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
}));

const getUsersProcedure = os
  .output(UsersArraySchema)
  .handler(() => getActiveUsers());

const generatePairingProcedure = os.output(PairingSchema).handler(() => {
  const { user1, user2 } = generateRandomPairing();
  return { user1, user2, timestamp: new Date().toISOString() };
});

export const router = {
  health: healthProcedure,
  getUsers: getUsersProcedure,
  generatePairing: generatePairingProcedure,
};

export type Router = typeof router;
