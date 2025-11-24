import { createFeature, createSelector } from '@ngrx/store';
import { scheduleReducer } from './schedule.reducer';
import { scheduleAdapter } from './schedule.adapter';
import {
  selectAllSubjects,
  selectSubjectsEntities,
} from '../subjects/subjects.selectors';

export const scheduleFeature = createFeature({
  name: 'schedule',
  reducer: scheduleReducer,
});

const { selectScheduleState } = scheduleFeature;

const { selectAll, selectEntities, selectIds, selectTotal } =
  scheduleAdapter.getSelectors();

export const selectAllSchedule = createSelector(selectScheduleState, selectAll);

export const selectScheduleEntities = createSelector(
  selectScheduleState,
  selectEntities
);

export const selectScheduleLoading = createSelector(
  selectScheduleState,
  (state) => state.loading
);

export const selectScheduleLoaded = createSelector(
  selectScheduleState,
  (state) => state.loaded
);

export const selectScheduleError = createSelector(
  selectScheduleState,
  (state) => state.error
);

export const selectScheduleById = (id: number) =>
  createSelector(selectScheduleEntities, (entities) => entities[id] ?? null);

export const selectScheduleByUserId = (userId: number) =>
  createSelector(
    selectAllSchedule,
    (schedules) => schedules.find((s) => s.userId === userId) ?? null
  );

export const selectScheduleWithSubjectsForUser = (userId: number) =>
  createSelector(
    selectScheduleByUserId(userId),
    selectSubjectsEntities,
    (schedule, subjects) => {
      if (!schedule) return [];

      return schedule.blocks.map((block) => ({
        dia: block.day,
        asignatura: subjects[block.subjectId]?.name ?? 'Sin nombre',
        hora_inicio: block.startTime,
        hora_fin: block.endTime,
      }));
    }
  );

export const selectSubjectsFromSchedule = (userId: number) =>
  createSelector(
    selectScheduleByUserId(userId), // schedule REAL
    selectAllSubjects,
    (schedule, subjects) => {
      if (!schedule) return [];

      const ids = schedule.blocks.map((b) => b.subjectId);

      return subjects.filter((s) => ids.includes(s.id));
    }
  );

export const selectScheduleAddError = createSelector(
  selectScheduleState,
  (state) => state.error ?? null
);
