import { os } from '@orpc/server';
import { UsersArraySchema } from '@/types/user';
import { PairingSchema } from '@/types/pairing';
import { HistorySchema } from '@/types/winner';
import { getActiveUsers, generateRandomPairing } from '@/services/users';
import { generateAndSavePairing, getPairingHistory, getLatestPairing, regenerateLatestPairing } from '@/services/winners';
import { z } from 'zod';

const healthProcedure = os.handler(() => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
}));

const getUsersProcedure = os
  .output(UsersArraySchema)
  .handler(async () => await getActiveUsers());

const generatePairingProcedure = os.output(PairingSchema).handler(async () => {
  const { user1, user2 } = await generateRandomPairing();
  return { user1, user2, timestamp: new Date().toISOString() };
});

const generateAndSavePairingProcedure = os
  .output(PairingSchema)
  .handler(async () => await generateAndSavePairing());

const getPairingHistoryProcedure = os
  .output(z.array(HistorySchema))
  .handler(async () => await getPairingHistory());

const getLatestPairingProcedure = os
  .output(HistorySchema.nullable())
  .handler(async () => await getLatestPairing());

const regenerateLatestPairingProcedure = os
  .output(HistorySchema.nullable())
  .handler(async () => await regenerateLatestPairing());

export const router = {
  health: healthProcedure,
  getUsers: getUsersProcedure,
  generatePairing: generatePairingProcedure,
  generateAndSavePairing: generateAndSavePairingProcedure,
  getPairingHistory: getPairingHistoryProcedure,
  getLatestPairing: getLatestPairingProcedure,
  regenerateLatestPairing: regenerateLatestPairingProcedure,
};

export type Router = typeof router;

// Define History type for frontend use (matches Prisma model)
export interface History {
  id: number;
  firstWinnerName: string;
  firstWinnerGithub: string;
  secondWinnerName: string;
  secondWinnerGithub: string;
  createdAt: Date;
}
