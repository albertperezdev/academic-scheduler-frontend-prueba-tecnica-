import { createEntityAdapter } from '@ngrx/entity';
import { User } from './users.models';

export const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
});
