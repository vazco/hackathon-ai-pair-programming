import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import type { History } from '@/lib/api-client';
import { PairingDisplay } from './PairingDisplay';
import { ActionButtons } from './ActionButtons';

type HistoryCardProps = {
  history: History;
  index: number;
  recentlyCompleted: { id: number; timestamp: number }[];
  reminderUsers?: Set<string>;
  onRegamble?: () => void;
  onMarkCompleted?: (id: number) => void;
  onUndoCompleted?: (id: number) => void;
  getRemainingTime: (timestamp: number) => number;
};

export function HistoryCard({
  history,
  index,
  recentlyCompleted,
  reminderUsers,
  onRegamble,
  onMarkCompleted,
  onUndoCompleted,
  getRemainingTime,
}: HistoryCardProps) {
  const { t } = useTranslation();

  return (
    <Card
      className={`p-4 ${history.completed ? 'opacity-60 bg-muted/20' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`text-sm ${history.completed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}
            >
              {new Date(history.createdAt).toLocaleDateString('pl-PL', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            {history.completed && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle size={16} />
                <span className="text-xs font-medium">{t('completed')}</span>
              </div>
            )}
          </div>
          <PairingDisplay
            firstUser={{
              name: history.firstWinnerName,
              github: history.firstWinnerGithub,
              active: true,
            }}
            secondUser={{
              name: history.secondWinnerName,
              github: history.secondWinnerGithub,
              active: true,
            }}
            completed={history.completed}
            reminderUsers={reminderUsers}
          />
        </div>
        <ActionButtons
          historyId={history.id}
          index={index}
          completed={history.completed}
          recentlyCompleted={recentlyCompleted}
          onRegamble={onRegamble}
          onMarkCompleted={onMarkCompleted}
          onUndoCompleted={onUndoCompleted}
          getRemainingTime={getRemainingTime}
        />
      </div>
    </Card>
  );
}
