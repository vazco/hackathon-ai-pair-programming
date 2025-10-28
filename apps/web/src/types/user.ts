export interface User {
  name: string;
  active: boolean;
  github: string;
}

export interface Pairing {
  user1: User;
  user2: User;
  timestamp: string;
  reminderUsers: string[];
}

export interface Winner {
  pairing: Pairing;
  selectedAt: string;
  week: string;
}
