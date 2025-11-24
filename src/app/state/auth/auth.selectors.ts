import { createFeature, createSelector } from '@ngrx/store';
import { authReducer } from './auth.reducer';

export const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer,
});

const { selectAuthState } = authFeature;

export const selectAuthUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state) => state.isLoggedIn
);
