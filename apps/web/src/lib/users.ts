export type User = {
  name: string;
  active: boolean;
  github: string;
};

export function parseUsersFromBase64(encoded: string | undefined): User[] {
  if (!encoded) return [];

  try {
    const decoded = decodeURIComponent(atob(encoded));
    return JSON.parse(decoded) as User[];
  } catch {
    return [];
  }
}

export function getActiveUsers(users: User[]): User[] {
  return users.filter((user) => user.active);
}

export function generateRandomPair(
  users: User[]
): { user1: User; user2: User } | null {
  const activeUsers = getActiveUsers(users);
  if (activeUsers.length < 2) return null;

  const shuffled = [...activeUsers].sort(() => Math.random() - 0.5);
  return { user1: shuffled[0]!, user2: shuffled[1]! };
}
