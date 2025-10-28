import { Pairing } from '@/types/user';

interface PairingHistoryProps {
  pairings: Pairing[];
}

export function PairingHistory({ pairings }: PairingHistoryProps) {
  if (pairings.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Pairing History
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
            <div className="flex-1 flex items-center gap-4">
              <UserInfo user={pairing.user1} />
              <div className="text-muted-foreground font-bold">+</div>
              <UserInfo user={pairing.user2} />
            </div>
            <div className="text-sm text-muted-foreground">
              {formatTimestamp(pairing.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface UserInfoProps {
  user: { name: string; github: string };
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

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
