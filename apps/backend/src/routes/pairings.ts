import { os } from '@orpc/server';
import { PairingSchema } from '@/schemas/pairing';
import { HistorySchema, HistoryWithRemindersSchema } from '@/schemas/winner';
import {
  generateAndSavePairing,
  getPairingHistory,
  getLatestPairing,
  regenerateLatestPairing,
  markPairingCompleted,
  undoPairingCompleted,
} from '@/services/winners';
import { z } from 'zod';

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
  .output(PairingSchema.nullable())
  .handler(async () => await regenerateLatestPairing());

const markCompletedProcedure = os
  .input(z.object({ id: z.number() }))
  .output(HistoryWithRemindersSchema)
  .handler(async ({ input }) => await markPairingCompleted(input.id));

const undoCompletedProcedure = os
  .input(z.object({ id: z.number() }))
  .output(HistoryWithRemindersSchema)
  .handler(async ({ input }) => await undoPairingCompleted(input.id));

export const pairingRoutes = {
  generateAndSavePairing: generateAndSavePairingProcedure,
  getPairingHistory: getPairingHistoryProcedure,
  getLatestPairing: getLatestPairingProcedure,
  regenerateLatestPairing: regenerateLatestPairingProcedure,
  markCompleted: markCompletedProcedure,
  undoCompleted: undoCompletedProcedure,
};
