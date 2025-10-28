import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { generateRandomPairing } from './users';

export async function generateAndSavePairing() {
  const { user1, user2 } = await generateRandomPairing();

  await prisma.history.create({
    data: {
      firstWinnerName: user1.name,
      firstWinnerGithub: user1.github,
      secondWinnerName: user2.name,
      secondWinnerGithub: user2.github,
    },
  });

  logger.info('Pairing saved to history');

  const { getAllUsers } = await import('./users');
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

  return { user1, user2, timestamp: new Date().toISOString(), reminderUsers };
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

  await prisma.history.update({
    where: { id: latest.id },
    data: {
      firstWinnerName: user1.name,
      firstWinnerGithub: user1.github,
      secondWinnerName: user2.name,
      secondWinnerGithub: user2.github,
    },
  });

  logger.info('Latest pairing regenerated');

  // Calculate reminder users
  const { getAllUsers } = await import('./users');
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

  return { user1, user2, timestamp: new Date().toISOString(), reminderUsers };
}

export async function markPairingCompleted(id: number) {
  try {
    const updated = await prisma.history.update({
      where: { id },
      data: { completed: true },
    });
    logger.info(`Pairing ${id} marked as completed`);

    // Calculate reminder users
    const { getAllUsers } = await import('./users');
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

    // Calculate reminder users
    const { getAllUsers } = await import('./users');
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

    return { history: updated, reminderUsers };
  } catch (error) {
    logger.error(`Failed to undo pairing ${id} completion: ${error}`);
    return { history: null, reminderUsers: [] };
  }
}
