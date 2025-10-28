import { z } from 'zod';

export const HistorySchema = z.object({
  id: z.number(),
  firstWinnerName: z.string(),
  firstWinnerGithub: z.string(),
  secondWinnerName: z.string(),
  secondWinnerGithub: z.string(),
  createdAt: z.date(),
});

export type { History } from '@/generated/prisma';
