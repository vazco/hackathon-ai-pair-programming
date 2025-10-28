import { User } from '@/types/user';
import { cn } from '@/lib/utils';

interface PairingResultProps {
  user1: User | null;
  user2: User | null;
  isAnimating: boolean;
}

export function PairingResult({ user1, user2, isAnimating }: PairingResultProps) {
  if (!user1 || !user2) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">Click the Gamble button to select a random pair</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 py-8">
      <UserCard user={user1} isAnimating={isAnimating} />
      <UserCard user={user2} isAnimating={isAnimating} />
    </div>
  );
}

interface UserCardProps {
  user: User;
  isAnimating: boolean;
}

function UserCard({ user, isAnimating }: UserCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center p-8 bg-card rounded-lg border-2 border-border shadow-lg transition-all duration-300',
        isAnimating && 'animate-pulse scale-95'
      )}
    >
      <div
        className={cn(
          'relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-primary shadow-xl transition-transform duration-500',
          isAnimating && 'animate-spin'
        )}
      >
        {user.github ? (
          <img
            src={`https://github.com/${user.github}.png?size=200`}
            alt={user.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground text-3xl font-bold',
            user.github && 'hidden'
          )}
        >
          {user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">{user.name}</h3>
      {user.github && (
        <a
          href={`https://github.com/${user.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          @{user.github}
        </a>
      )}
    </div>
  );
}
