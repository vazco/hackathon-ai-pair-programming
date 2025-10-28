import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string(),
  active: z.boolean(),
  github: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const UsersArraySchema = z.array(UserSchema);
