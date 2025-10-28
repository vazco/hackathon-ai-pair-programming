import type { History } from '@/router';
import { generateRandomPairing } from './users';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/db';
import type { Pairing } from '@/types/pairing';

export async function generateAndSavePairing(): Promise<Pairing> {
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
  return { user1, user2, timestamp: new Date().toISOString() };
}

export async function getPairingHistory(): Promise<History[]> {
  const history = await prisma.history.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return history;
}

export async function getLatestPairing(): Promise<History | null> {
  const history = await prisma.history.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  return history;
}

export async function regenerateLatestPairing(): Promise<History | null> {
  const latest = await getLatestPairing();
  if (!latest) return null;

  let { user1, user2 } = await generateRandomPairing();

  while (
    (user1.name === latest.firstWinnerName && user2.name === latest.secondWinnerName) ||
    (user1.name === latest.secondWinnerName && user2.name === latest.firstWinnerName)
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
  return await getLatestPairing();
}
