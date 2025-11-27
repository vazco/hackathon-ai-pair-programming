import { useTranslation } from 'react-i18next';
import type { Pairing, User } from '@/lib/api-client';

type PairingHistoryProps = {
  pairings: Pairing[];
};

export function PairingHistory({ pairings }: PairingHistoryProps) {
  const { t } = useTranslation();

  if (pairings.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {t('pairingHistory')}
      </h2>
      <div className="space-y-4">
        {pairings.map((pairing, index) => (
          <div
            key={pairing.timestamp}
            className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              {pairings.length - index}
            </div>
            <div className="flex-1 grid grid-cols-3 items-center gap-4">
              <UserInfo user={pairing.user1} />
              <UserInfo user={pairing.user2} />
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
                  {t('mark')}
                </button>
                <button className="px-3 py-1 text-sm border border-border rounded hover:bg-muted">
                  {t('manage')}
                </button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatTimestamp(pairing.timestamp, t)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type UserInfoProps = {
  user: User;
};

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
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
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
      <span className="font-medium text-foreground">{user.name}</span>
    </div>
  );
}

function formatTimestamp(
  timestamp: string,
  t: (key: string, options?: { count: number }) => string
): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t('justNow');
  if (diffMins < 60) return t('minutesAgo', { count: diffMins });
  if (diffHours < 24) return t('hoursAgo', { count: diffHours });
  if (diffDays < 7) return t('daysAgo', { count: diffDays });

  return date.toLocaleDateString('pl-PL', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
