import { User } from '../../resources/users/entities/user.entity';

export const findUserOrFail = (users: Array<User>, username: string): User => {
  const user: User | undefined = users.find((u) => u.username === username);
  if (!user) throw new Error(`User with username '${username}' not found.`);
  return user;
};
