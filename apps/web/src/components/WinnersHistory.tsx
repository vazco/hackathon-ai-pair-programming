import { useTranslation } from 'react-i18next';
import type { History } from '@/lib/api-client';
import { useState, useEffect } from 'react';
import { HistoryCard } from './HistoryCard';

type WinnersHistoryProps = {
  winners: History[];
  onRegamble?: () => void;
  onMarkCompleted?: (id: number) => void;
  onUndoCompleted?: (id: number) => void;
  recentlyCompleted?: { id: number; timestamp: number }[];
  reminderUsers?: Set<string>;
};

export function WinnersHistory({
  winners,
  onRegamble,
  onMarkCompleted,
  onUndoCompleted,
  recentlyCompleted = [],
  reminderUsers,
}: WinnersHistoryProps) {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getRemainingTime = (timestamp: number) => {
    const elapsed = Math.floor((currentTime - timestamp) / 1000);
    return Math.max(0, 5 - elapsed);
  };

  if (winners.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">{t('pairingHistory')}</h2>
      <div className="space-y-3">
        {winners.map((history, index) => (
          <HistoryCard
            key={history.id}
            history={history}
            index={index}
            recentlyCompleted={recentlyCompleted}
            reminderUsers={reminderUsers}
            onRegamble={onRegamble}
            onMarkCompleted={onMarkCompleted}
            onUndoCompleted={onUndoCompleted}
            getRemainingTime={getRemainingTime}
          />
        ))}
      </div>
    </div>
  );
}
