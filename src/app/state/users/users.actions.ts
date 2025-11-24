import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from './users.models';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ users: User[] }>(),
    'Load Failure': props<{ error: string }>(),

    Add: props<{ user: User }>(),

    Update: props<{ user: User }>(),

    Delete: props<{ id: number }>(),
  },
});
