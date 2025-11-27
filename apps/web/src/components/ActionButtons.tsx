import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

type ActionButtonsProps = {
  historyId: number;
  index: number;
  completed: boolean;
  recentlyCompleted: { id: number; timestamp: number }[];
  onRegamble?: () => void;
  onMarkCompleted?: (id: number) => void;
  onUndoCompleted?: (id: number) => void;
  getRemainingTime: (timestamp: number) => number;
};

export function ActionButtons({
  historyId,
  index,
  completed,
  recentlyCompleted,
  onRegamble,
  onMarkCompleted,
  onUndoCompleted,
  getRemainingTime,
}: ActionButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      {index === 0 && onRegamble && !completed && (
        <Button onClick={onRegamble} variant="outline" size="sm">
          {t('regamble')}
        </Button>
      )}
      {recentlyCompleted.some((item) => item.id === historyId) &&
        onUndoCompleted &&
        (() => {
          const item = recentlyCompleted.find((item) => item.id === historyId);
          const remainingTime = item ? getRemainingTime(item.timestamp) : 0;
          return remainingTime > 0 ? (
            <Button
              onClick={() => onUndoCompleted(historyId)}
              variant="outline"
              size="sm"
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              {t('undo')} ({remainingTime}s)
            </Button>
          ) : null;
        })()}
      {!completed &&
        !recentlyCompleted.some((item) => item.id === historyId) &&
        onMarkCompleted && (
          <Button
            onClick={() => onMarkCompleted(historyId)}
            variant="outline"
            size="sm"
          >
            {t('markCompleted')}
          </Button>
        )}
    </div>
  );
}
