import type { User } from '@/lib/api-client';
import { UserInfo } from './UserInfo';

type PairingDisplayProps = {
  firstUser: User;
  secondUser: User;
  completed?: boolean;
  reminderUsers?: Set<string>;
};

export function PairingDisplay({
  firstUser,
  secondUser,
  completed = false,
  reminderUsers,
}: PairingDisplayProps) {
  return (
    <div className="flex items-center gap-4">
      <UserInfo
        user={firstUser}
        completed={completed}
        reminderUsers={reminderUsers}
      />
      <span
        className={`text-muted-foreground ${completed ? 'opacity-50' : ''}`}
      >
        ×
      </span>
      <UserInfo
        user={secondUser}
        completed={completed}
        reminderUsers={reminderUsers}
      />
    </div>
  );
}
