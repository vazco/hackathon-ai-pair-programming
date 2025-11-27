import type { User } from '@/lib/api-client';
import { AlertTriangle } from 'lucide-react';

type UserInfoProps = {
  user: User;
  completed?: boolean;
  reminderUsers?: Set<string>;
};

export function UserInfo({
  user,
  completed = false,
  reminderUsers,
}: UserInfoProps) {
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
        {user.github && reminderUsers?.has(user.github) && (
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
        )}
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
