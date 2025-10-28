import { User } from '@/types/user';
import type { History } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WinnersHistoryProps {
  winners: History[];
  onRegamble?: () => void;
  onMarkCompleted?: (id: number) => void;
  onUndoCompleted?: (id: number) => void;
  recentlyCompleted?: { id: number; timestamp: number }[];
}

interface UserInfoProps {
  user: User;
  completed?: boolean;
}

function UserInfo({ user, completed = false }: UserInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0 ${completed ? 'border-muted-foreground/50' : 'border-primary'}`}
      >
        {user.github ? (
          <img
            src={`https://github.com/${user.github}.png?size=100`}
            alt={user.name}
            className={`w-full h-full object-cover ${completed ? 'opacity-60' : ''}`}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback instanceof HTMLElement) {
                fallback.classList.remove('hidden');
              }
            }}
          />
        ) : null}
        <div
          className={`w-full h-full flex items-center justify-center text-primary-foreground text-xs font-bold ${user.github ? 'hidden' : ''} ${completed ? 'bg-muted-foreground/50' : 'bg-primary'}`}
        >
          {user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`font-medium ${completed ? 'text-muted-foreground' : 'text-foreground'}`}
        >
          {user.name}
        </span>
        {user.github && (
          <a
            href={`https://github.com/${user.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs hover:text-primary ${completed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}
          >
            @{user.github}
          </a>
        )}
      </div>
    </div>
  );
}

export function WinnersHistory({
  winners,
  onRegamble,
  onMarkCompleted,
  onUndoCompleted,
  recentlyCompleted = [],
}: WinnersHistoryProps) {
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
      <h2 className="text-2xl font-bold mb-4">Pairing History</h2>
      <div className="space-y-3">
        {winners.map((history, index) => (
          <Card
            key={history.id}
            className={`p-4 ${history.completed ? 'opacity-60 bg-muted/20' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-sm ${history.completed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}
                  >
                    {new Date(history.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {history.completed && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle size={16} />
                      <span className="text-xs font-medium">Completed</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <UserInfo
                    user={{
                      name: history.firstWinnerName,
                      github: history.firstWinnerGithub,
                      active: true,
                    }}
                    completed={history.completed}
                  />
                  <span
                    className={`text-muted-foreground ${history.completed ? 'opacity-50' : ''}`}
                  >
                    ×
                  </span>
                  <UserInfo
                    user={{
                      name: history.secondWinnerName,
                      github: history.secondWinnerGithub,
                      active: true,
                    }}
                    completed={history.completed}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {index === 0 && onRegamble && !history.completed && (
                  <Button onClick={onRegamble} variant="outline" size="sm">
                    Regamble
                  </Button>
                )}
                {recentlyCompleted.some((item) => item.id === history.id) &&
                  onUndoCompleted &&
                  (() => {
                    const item = recentlyCompleted.find(
                      (item) => item.id === history.id
                    );
                    const remainingTime = item
                      ? getRemainingTime(item.timestamp)
                      : 0;
                    return remainingTime > 0 ? (
                      <Button
                        onClick={() => onUndoCompleted(history.id)}
                        variant="outline"
                        size="sm"
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      >
                        Undo ({remainingTime}s)
                      </Button>
                    ) : null;
                  })()}
                {!history.completed &&
                  !recentlyCompleted.some((item) => item.id === history.id) &&
                  onMarkCompleted && (
                    <Button
                      onClick={() => onMarkCompleted(history.id)}
                      variant="outline"
                      size="sm"
                    >
                      Mark Completed
                    </Button>
                  )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
