import { createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.actions';
import { usersAdapter } from './users.adapter';
import { UsersState } from './users.models';

export const initialState: UsersState = usersAdapter.getInitialState({
  loaded: false,
  loading: false,
  error: null,
});

export const usersReducer = createReducer(
  initialState,

  on(UsersActions.load, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.loadSuccess, (state, { users }) =>
    usersAdapter.setAll(users, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),

  on(UsersActions.add, (state, { user }) => usersAdapter.addOne(user, state)),

  on(UsersActions.update, (state, { user }) =>
    usersAdapter.updateOne({ id: user.id, changes: user }, state)
  ),

  on(UsersActions.delete, (state, { id }) => usersAdapter.removeOne(id, state))
);
