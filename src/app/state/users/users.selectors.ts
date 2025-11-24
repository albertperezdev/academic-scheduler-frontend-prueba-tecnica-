import { createFeature, createSelector } from '@ngrx/store';
import { usersReducer } from './users.reducer';
import { usersAdapter } from './users.adapter';

// 1️⃣ Crear el feature igual que en auth
export const usersFeature = createFeature({
  name: 'users',
  reducer: usersReducer,
});

// 2️⃣ Extraer el selector raíz del feature (igual que auth)
const { selectUsersState } = usersFeature;

// 3️⃣ EntitySelectors
const { selectAll, selectEntities, selectIds, selectTotal } =
  usersAdapter.getSelectors();

// 4️⃣ Selectores creados siguiendo tu arquitectura

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
