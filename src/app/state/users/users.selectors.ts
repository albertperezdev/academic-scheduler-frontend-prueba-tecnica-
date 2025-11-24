import { createFeature, createSelector } from '@ngrx/store';
import { usersReducer } from './users.reducer';
import { usersAdapter } from './users.adapter';

export const usersFeature = createFeature({
  name: 'users',
  reducer: usersReducer,
});

const { selectUsersState } = usersFeature;

const { selectAll, selectEntities, selectIds, selectTotal } =
  usersAdapter.getSelectors();

export const selectAllUsers = createSelector(selectUsersState, selectAll);

export const selectUsersEntities = createSelector(
  selectUsersState,
  selectEntities
);

export const selectUsersIds = createSelector(selectUsersState, selectIds);

export const selectUsersTotal = createSelector(selectUsersState, selectTotal);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state) => state.loading
);

export const selectUsersLoaded = createSelector(
  selectUsersState,
  (state) => state.loaded
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state) => state.error
);
export const selectAllProfessors = createSelector(selectAllUsers, (users) =>
  users.filter((u) => u.role === 'profesor')
);
