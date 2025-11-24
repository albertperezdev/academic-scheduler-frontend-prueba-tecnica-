import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { AuthState } from './auth.models';

export const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

export const authReducer = createReducer(
  initialState,

  // LOGIN (solo activa flujo, no guarda nada)
  on(AuthActions.login, (state) => ({
    ...state,
  })),

  // LOGIN SUCCESS
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoggedIn: true,
  })),

  // LOGIN FAILURE
  on(AuthActions.loginFailure, (state) => ({
    ...state,
    user: null,
    isLoggedIn: false,
  })),

  // LOGOUT
  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
    isLoggedIn: false,
  })),

  on(AuthActions.hydrateSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoggedIn: !!user,
  }))
);
