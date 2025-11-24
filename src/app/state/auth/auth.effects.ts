import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './auth.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { LoginService } from '../../services/auth/login';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private loginService = inject(LoginService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.loginService.login(email, password).pipe(
          map((user) =>
            user
              ? AuthActions.loginSuccess({ user })
              : AuthActions.loginFailure({ error: 'Credenciales incorrectas' })
          ),
          catchError(() =>
            of(AuthActions.loginFailure({ error: 'Error de servidor' }))
          )
        )
      )
    )
  );

  // Guardar en localStorage
  persistUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user }) => localStorage.setItem('user', JSON.stringify(user)))
      ),
    { dispatch: false }
  );

  // Redirección
  redirectSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  hydrate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.hydrate),
      map(() => {
        const raw = localStorage.getItem('user');

        if (!raw) {
          return AuthActions.hydrateSuccess({ user: null });
        }

        const user = JSON.parse(raw);
        return AuthActions.hydrateSuccess({ user });
      })
    )
  );
}
