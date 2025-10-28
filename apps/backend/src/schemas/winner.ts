import { z } from 'zod';

export const HistorySchema = z.object({
  id: z.number(),
  firstWinnerName: z.string(),
  firstWinnerGithub: z.string(),
  secondWinnerName: z.string(),
  secondWinnerGithub: z.string(),
  completed: z.boolean(),
  createdAt: z.date(),
});

export const HistoryWithRemindersSchema = z.object({
  history: HistorySchema.nullable(),
  reminderUsers: z.array(z.string()),
});

export type HistoryWithReminders = z.infer<typeof HistoryWithRemindersSchema>;
