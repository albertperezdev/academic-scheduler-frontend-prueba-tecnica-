import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ScheduleActions } from './schedule.actions';
import { Store } from '@ngrx/store';
import { ScheduleService } from '../../services/schedule/schedule';
import { selectAuthUser } from '../auth/auth.selectors';
import { selectScheduleByUserId } from './schedule.selectors';

import { of, map, catchError, withLatestFrom, switchMap, take } from 'rxjs';

function backendToSchedule(rows: any[]) {
  if (!rows || rows.length === 0) return null;

  const userId = rows[0].usuario_id;

  return {
    id: userId,
    userId,
    blocks: rows.map((row) => ({
      id: row.id,
      day: row.dia,
      name: row.asignatura?.nombre ?? '',
      startTime: row.hora_inicio,
      endTime: row.hora_fin,
      subjectId: row.asignatura_id,
    })),
  };
}

@Injectable()
export class ScheduleEffects {
  private actions$ = inject(Actions);
  private scheduleService = inject(ScheduleService);
  private store = inject(Store);

  // =====================================================
  // LOAD
  // =====================================================
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.load),
      switchMap(({ userId }) =>
        this.scheduleService.getByUser(userId).pipe(
          map((rows) => {
            const schedule = backendToSchedule(rows);

            if (!schedule) {
              return ScheduleActions.loadFailure({
                error: 'No hay horario para este usuario.',
              });
            }

            return ScheduleActions.loadSuccess({
              schedule: [schedule],
            });
          }),
          catchError(() =>
            of(
              ScheduleActions.loadFailure({ error: 'Error cargando horario.' })
            )
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.addClass),
      withLatestFrom(this.store.select(selectAuthUser)),
      switchMap(([{ block }, user]) => {
        const dto = {
          dia: block.day,
          hora_inicio: block.startTime,
          hora_fin: block.endTime,
          usuario_id: user!.id,
          asignatura_id: block.subjectId,
        };

        return this.scheduleService.create(dto).pipe(
          switchMap(() =>
            this.scheduleService.getByUser(user!.id).pipe(
              map((rows) => {
                const schedule = backendToSchedule(rows);

                if (!schedule) {
                  return ScheduleActions.addFailure({
                    error: 'No se pudo construir el horario.',
                  });
                }

                return ScheduleActions.addSuccess({ schedule });
              })
            )
          ),
          catchError(() =>
            of(ScheduleActions.addFailure({ error: 'Error agregando clase.' }))
          )
        );
      })
    )
  );

  edit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.editClass),
      withLatestFrom(this.store.select(selectAuthUser)),
      switchMap(([{ index, block }, user]) =>
        this.store.select(selectScheduleByUserId(user!.id)).pipe(
          take(1),
          switchMap((schedule) => {
            const real = schedule!.blocks[index];

            const dto = {
              dia: block.day,
              hora_inicio: block.startTime,
              hora_fin: block.endTime,
              asignatura_id: block.subjectId,
            };

            return this.scheduleService.update(real.id, dto).pipe(
              switchMap(() =>
                this.scheduleService.getByUser(user!.id).pipe(
                  map((rows) => {
                    const schedule = backendToSchedule(rows);

                    if (!schedule) {
                      return ScheduleActions.loadFailure({
                        error: 'No se pudo cargar el horario luego de editar.',
                      });
                    }

                    return ScheduleActions.loadSuccess({
                      schedule: [schedule],
                    });
                  })
                )
              ),
              catchError(() =>
                of(
                  ScheduleActions.editFailure({
                    error: 'Error editando la clase.',
                  })
                )
              )
            );
          })
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.removeClass),
      withLatestFrom(this.store.select(selectAuthUser)),
      switchMap(([{ index }, user]) =>
        this.store.select(selectScheduleByUserId(user!.id)).pipe(
          take(1),
          switchMap((schedule) => {
            const real = schedule!.blocks[index];

            return this.scheduleService.delete(real.id).pipe(
              switchMap(() =>
                this.scheduleService.getByUser(user!.id).pipe(
                  map((rows) => {
                    const schedule = backendToSchedule(rows);

                    if (!schedule) {
                      return ScheduleActions.loadFailure({
                        error:
                          'No se pudo cargar el horario luego de eliminar.',
                      });
                    }

                    return ScheduleActions.loadSuccess({
                      schedule: [schedule],
                    });
                  })
                )
              ),
              catchError(() =>
                of(
                  ScheduleActions.deleteFailure({
                    error: 'Error eliminando clase.',
                  })
                )
              )
            );
          })
        )
      )
    )
  );
}
