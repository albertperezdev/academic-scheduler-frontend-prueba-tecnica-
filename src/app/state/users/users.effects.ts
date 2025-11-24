import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersActions } from './users.actions';
import { LoginService } from '../../services/auth/login';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private loginService = inject(LoginService);
  private messageService = inject(MessageService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.load),
      switchMap(() =>
        this.loginService.getUsers().pipe(
          map((users) =>
            UsersActions.loadSuccess({
              users: (users ?? []).map((u: any) => ({
                id: u.id,
                email: u.email,
                password: u.password,
                role: u.role,
                name: u.nombre ?? u.name,
                active:
                  typeof u.active !== 'undefined'
                    ? u.active
                    : u.activeUser ?? true,
              })),
            })
          ),
          catchError((err) => {
            console.error('Error loading users:', err, err?.error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err?.error?.message ?? 'Error al cargar usuarios',
            });
            return of(
              UsersActions.loadFailure({ error: 'Error al cargar usuarios' })
            );
          })
        )
      )
    )
  );

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.add),
      switchMap(({ user }) => {
        const payload: any = {
          nombre: user.name,
          email: user.email,
          password: user.password,
          role: user.role as 'estudiante' | 'profesor' | 'admin',
        };

        if (typeof user.active !== 'undefined') payload.active = user.active;

        console.log('UsersEffects.addUser payload:', payload);

        return this.loginService.addNewUser(payload).pipe(
          switchMap(() =>
            this.loginService.getUsers().pipe(
              map((users) =>
                UsersActions.loadSuccess({
                  users: (users ?? []).map((u: any) => ({
                    id: u.id,
                    email: u.email,
                    password: u.password,
                    role: u.role,
                    name: u.nombre ?? u.name,
                    active:
                      typeof u.active !== 'undefined'
                        ? u.active
                        : u.activeUser ?? true,
                  })),
                })
              ),
              catchError((err) => {
                console.error(
                  'Error reloading users after add:',
                  err,
                  err?.error
                );
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: err?.error?.message ?? 'Error al cargar usuarios',
                });
                return of(
                  UsersActions.loadFailure({
                    error: 'Error al cargar usuarios',
                  })
                );
              })
            )
          ),
          catchError((err) => {
            console.error('Error adding user:', err, err?.error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err?.error?.message ?? 'Error al agregar usuario',
            });
            return of(
              UsersActions.loadFailure({ error: 'Error al agregar usuario' })
            );
          })
        );
      })
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.update),
      switchMap(({ user }) =>
        this.loginService.updateUser(user).pipe(
          switchMap(() =>
            this.loginService.getUsers().pipe(
              map((users) =>
                UsersActions.loadSuccess({
                  users: (users ?? []).map((u: any) => ({
                    id: u.id,
                    email: u.email,
                    password: u.password,
                    role: u.role,
                    name: u.nombre ?? u.name,
                    active:
                      typeof u.active !== 'undefined'
                        ? u.active
                        : u.activeUser ?? true,
                  })),
                })
              ),
              catchError((err) => {
                console.error(
                  'Error reloading users after update:',
                  err,
                  err?.error
                );
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: err?.error?.message ?? 'Error al cargar usuarios',
                });
                return of(
                  UsersActions.loadFailure({
                    error: 'Error al cargar usuarios',
                  })
                );
              })
            )
          ),
          catchError((err) => {
            console.error('Error updating user:', err, err?.error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err?.error?.message ?? 'Error al actualizar usuario',
            });
            return of(
              UsersActions.loadFailure({ error: 'Error al actualizar usuario' })
            );
          })
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.delete),
      switchMap(({ id }) =>
        this.loginService.deleteUser(id).pipe(
          switchMap(() =>
            this.loginService.getUsers().pipe(
              map((users) =>
                UsersActions.loadSuccess({
                  users: (users ?? []).map((u: any) => ({
                    id: u.id,
                    email: u.email,
                    password: u.password,
                    role: u.role,
                    name: u.nombre ?? u.name,
                    active:
                      typeof u.active !== 'undefined'
                        ? u.active
                        : u.activeUser ?? true,
                  })),
                })
              ),
              catchError((err) => {
                console.error(
                  'Error reloading users after delete:',
                  err,
                  err?.error
                );
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: err?.error?.message ?? 'Error al cargar usuarios',
                });
                return of(
                  UsersActions.loadFailure({
                    error: 'Error al cargar usuarios',
                  })
                );
              })
            )
          ),
          catchError((err) => {
            console.error('Error deleting user:', err, err?.error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err?.error?.message ?? 'Error al eliminar usuario',
            });
            return of(
              UsersActions.loadFailure({ error: 'Error al eliminar usuario' })
            );
          })
        )
      )
    )
  );
}
