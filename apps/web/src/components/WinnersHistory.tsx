import { User } from '@/types/user';
import type { History } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WinnersHistoryProps {
  winners: History[];
  onRegamble?: () => void;
}

interface UserInfoProps {
  user: User;
}

function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
        {user.github ? (
          <img
            src={`https://github.com/${user.github}.png?size=100`}
            alt={user.name}
            className="w-full h-full object-cover"
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
          className={`w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold ${user.github ? 'hidden' : ''}`}
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
        <span className="font-medium text-foreground">{user.name}</span>
        {user.github && (
          <a
            href={`https://github.com/${user.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            @{user.github}
          </a>
        )}
      </div>
    </div>
  );
}

export function WinnersHistory({ winners, onRegamble }: WinnersHistoryProps) {
  if (winners.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Pairing History</h2>
      <div className="space-y-3">
        {winners.map((history, index) => (
          <Card key={history.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-muted-foreground">
                    {new Date(history.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <UserInfo user={{ name: history.firstWinnerName, github: history.firstWinnerGithub, active: true }} />
                  <span className="text-muted-foreground">×</span>
                  <UserInfo user={{ name: history.secondWinnerName, github: history.secondWinnerGithub, active: true }} />
                </div>
              </div>
              {index === 0 && onRegamble && (
                <Button onClick={onRegamble} variant="outline" size="sm">
                  Regamble
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
