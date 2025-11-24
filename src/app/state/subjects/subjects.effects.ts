import { Injectable, inject } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { SubjectsActions } from './subjects.actions';
import { SubjectsService } from '../../services/subjects/subjects';
import { map, switchMap, catchError, of, withLatestFrom, tap } from 'rxjs';
import { ScheduleActions } from '../schedule/schedule.actions';
import { selectAuthUser } from '../auth/auth.selectors';
import { selectAllSubjects } from './subjects.selectors';
import { Store } from '@ngrx/store';
import { selectScheduleByUserId } from '../schedule/schedule.selectors';

@Injectable()
export class SubjectsEffects {
  private actions$ = inject(Actions);
  private service = inject(SubjectsService);
  private store = inject(Store);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.load),
      switchMap(() =>
        this.service.fetchAll().pipe(
          map((subjects) => SubjectsActions.loadSuccess({ subjects })),
          tap((s) => console.log('[SubjectsEffects] loadSuccess ->', s)),
          catchError((err) => {
            console.error('[SubjectsEffects] fetchAll error ->', err);
            return of(
              SubjectsActions.loadFailure({
                error: 'Error al cargar asignaturas',
              })
            );
          })
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.create),
      switchMap(({ subject }) =>
        this.service.add(subject as any).pipe(
          map(() => SubjectsActions.load()),
          catchError((err) => {
            console.error('[SubjectsEffects] create error ->', err);
            return of(
              SubjectsActions.loadFailure({ error: 'Error al crear materia' })
            );
          })
        )
      )
    )
  );

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => SubjectsActions.load())
    )
  );

  addClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.addClass),
      withLatestFrom(
        this.store.select(selectAuthUser),
        this.store.select(selectAllSubjects)
      ),
      map(([{ block }, user, subjects]) => {
        const subject = subjects.find((s) => s.id === block.subjectId);
        if (!subject) {
          return ScheduleActions.addFailure({
            error: 'Materia no encontrada',
          });
        }

        const schedule = this.store.selectSignal(
          selectScheduleByUserId(user!.id)
        )();

        const count = schedule
          ? schedule.blocks.filter((b) => b.subjectId === subject.id).length
          : 0;

        if (count >= subject.maxPerWeek) {
          return ScheduleActions.addFailure({
            error: `La materia "${subject.name}" ya alcanzó su límite semanal (${subject.maxPerWeek}).`,
          });
        }

        return ScheduleActions.addSuccess({ schedule: schedule! });
      })
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.update),
      switchMap(({ subject }) =>
        this.service.update(subject).pipe(
          map(() => SubjectsActions.load()),
          catchError((err) => {
            console.error('[SubjectsEffects] update error ->', err);
            return of(
              SubjectsActions.loadFailure({
                error: 'Error al actualizar materia',
              })
            );
          })
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.delete),
      switchMap(({ id }) =>
        this.service.delete(id).pipe(
          map(() => SubjectsActions.load()),
          catchError((err) => {
            console.error('[SubjectsEffects] delete error ->', err);
            return of(
              SubjectsActions.loadFailure({ error: 'Error al borrar materia' })
            );
          })
        )
      )
    )
  );
}
