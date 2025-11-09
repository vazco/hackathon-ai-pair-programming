import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { generateRandomPairing, getAllUsers } from './users';

/**
 * Calculates which users need reminders based on their pairing completion history.
 * A user needs a reminder if they have 5 or more incomplete pairings in their
 * most recent 5 pairing selections.
 *
 * @returns Array of GitHub usernames that need reminders
 */
async function calculateReminderUsers(): Promise<string[]> {
  const users = await getAllUsers();
  const history = await getPairingHistory();

  const reminderUsers: string[] = [];

  for (const user of users) {
    if (!user.github) continue;

    const userSelections = history
      .filter(
        (h) =>
          h.firstWinnerGithub === user.github ||
          h.secondWinnerGithub === user.github
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    if (
      userSelections.length >= 5 &&
      userSelections.every((h) => !h.completed)
    ) {
      reminderUsers.push(user.github);
    }
  }

  return reminderUsers;
}

export async function generateAndSavePairing() {
  const { user1, user2 } = await generateRandomPairing();

  const created = await prisma.history.create({
    data: {
      firstWinnerName: user1.name,
      firstWinnerGithub: user1.github,
      secondWinnerName: user2.name,
      secondWinnerGithub: user2.github,
    },
  });

  logger.info('Pairing saved to history');

  const reminderUsers = await calculateReminderUsers();

  return { user1, user2, timestamp: created.createdAt.toISOString(), reminderUsers };
}

export async function getPairingHistory() {
  const history = await prisma.history.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return history;
}

export async function getLatestPairing() {
  const history = await prisma.history.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  return history;
}

export async function regenerateLatestPairing() {
  const latest = await getLatestPairing();
  if (!latest) return null;

  let { user1, user2 } = await generateRandomPairing();

  while (
    (user1.name === latest.firstWinnerName &&
      user2.name === latest.secondWinnerName) ||
    (user1.name === latest.secondWinnerName &&
      user2.name === latest.firstWinnerName)
  ) {
    const newPair = await generateRandomPairing();
    user1 = newPair.user1;
    user2 = newPair.user2;
  }

  const updated = await prisma.history.update({
    where: { id: latest.id },
    data: {
      firstWinnerName: user1.name,
      firstWinnerGithub: user1.github,
      secondWinnerName: user2.name,
      secondWinnerGithub: user2.github,
    },
  });

  logger.info('Latest pairing regenerated');

  const reminderUsers = await calculateReminderUsers();

  return { user1, user2, timestamp: updated.createdAt.toISOString(), reminderUsers };
}

export async function markPairingCompleted(id: number) {
  try {
    const updated = await prisma.history.update({
      where: { id },
      data: { completed: true },
    });
    logger.info(`Pairing ${id} marked as completed`);

    const reminderUsers = await calculateReminderUsers();

    return { history: updated, reminderUsers };
  } catch (error) {
    logger.error(`Failed to mark pairing ${id} as completed: ${error}`);
    return { history: null, reminderUsers: [] };
  }
}

export async function undoPairingCompleted(id: number) {
  try {
    const updated = await prisma.history.update({
      where: { id },
      data: { completed: false },
    });
    logger.info(`Pairing ${id} marked as not completed`);

    const reminderUsers = await calculateReminderUsers();

    return { history: updated, reminderUsers };
  } catch (error) {
    logger.error(`Failed to undo pairing ${id} completion: ${error}`);
    return { history: null, reminderUsers: [] };
  }
}
