import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PairingResult } from '@/components/PairingResult';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import {
  generateRandomPair,
  parseUsersFromBase64,
  type User,
} from '@/lib/users';

type Pairing = { user1: User; user2: User };

export const Route = createFileRoute('/')({
  component: Index,
  validateSearch: (search: Record<string, unknown>) => ({
    users: (search.users as string) || undefined,
  }),
});

function Index() {
  const { t } = useTranslation();
  const { users: usersParam } = Route.useSearch();
  const users = parseUsersFromBase64(usersParam);
  const [currentPairing, setCurrentPairing] = useState<Pairing | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { playRandomizingSound, stopRandomizingSound, playWinnerSound } =
    useSoundEffects();

  useEffect(() => {
    if (isAnimating) {
      playRandomizingSound();
    } else {
      stopRandomizingSound();
    }
  }, [isAnimating, playRandomizingSound, stopRandomizingSound]);

  useEffect(() => {
    if (!isAnimating && currentPairing) {
      playWinnerSound();
    }
  }, [isAnimating, currentPairing, playWinnerSound]);

  const handleGeneratePairing = async () => {
    setIsAnimating(true);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const pair = generateRandomPair(users);
    setIsAnimating(false);
    if (pair) {
      setCurrentPairing(pair);
    }
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col flex-1 py-8 px-4 items-center justify-center">
        <div className="max-w-4xl mx-auto w-full text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">{t('noUsersProvided')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 py-8 px-4 items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">{t('subtitle')}</p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleGeneratePairing}
            disabled={isAnimating}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnimating ? t('generating') : t('gambleButton')}
          </button>
        </div>

        <PairingResult
          user1={currentPairing?.user1 || null}
          user2={currentPairing?.user2 || null}
          isAnimating={isAnimating}
          allUsers={users}
        />
      </div>
    </div>
  );
}
