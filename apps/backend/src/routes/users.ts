import { os } from '@orpc/server';
import { UsersArraySchema } from '@/schemas/user';
import { PairingSchema } from '@/schemas/pairing';
import { getActiveUsers, generateRandomPairing } from '@/services/users';

const getUsersProcedure = os
  .output(UsersArraySchema)
  .handler(async () => await getActiveUsers());

const generatePairingProcedure = os.output(PairingSchema).handler(async () => {
  const { user1, user2 } = await generateRandomPairing();
  return { user1, user2, timestamp: new Date().toISOString() };
});

export const userRoutes = {
  getUsers: getUsersProcedure,
  generatePairing: generatePairingProcedure,
};
