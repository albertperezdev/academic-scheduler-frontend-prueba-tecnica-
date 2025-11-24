import { createFeature, createSelector } from '@ngrx/store';
import { subjectsReducer } from './subjects.reducer';
import { subjectAdapter } from './subjects.adapter';
import { selectScheduleByUserId } from '../schedule/schedule.selectors';
import { selectAllUsers } from '../users/users.selectors';

export const subjectsFeature = createFeature({
  name: 'subjects',
  reducer: subjectsReducer,
});

const { selectSubjectsState } = subjectsFeature;

const { selectAll, selectEntities, selectIds, selectTotal } =
  subjectAdapter.getSelectors();

export const selectAllSubjects = createSelector(selectSubjectsState, selectAll);

export const selectSubjectsEntities = createSelector(
  selectSubjectsState,
  selectEntities
);

export const selectSubjectsTotal = createSelector(
  selectSubjectsState,
  selectTotal
);

export const selectSubjectsLoaded = createSelector(
  selectSubjectsState,
  (subjects) => subjects.loaded
);

export const selectSubjectsLoading = createSelector(
  selectSubjectsState,
  (subjects) => subjects.loading
);

export const selectSubjectsError = createSelector(
  selectSubjectsState,
  (subjects) => subjects.error
);

export const selectSubjectById = (id: number) =>
  createSelector(selectSubjectsEntities, (entities) => entities[id] ?? null);

export const selectSubjectsByProfessor = (profesorId: number) =>
  createSelector(selectAllSubjects, (subjects) =>
    subjects.filter((s) => s.profesorId === profesorId)
  );

export const selectSubjectsWithProfessorName = createSelector(
  selectAllSubjects,
  selectAllUsers,
  (subjects, users) => {
    return subjects.map((subject) => {
      const profesor = users.find((user) => user.id === subject.profesorId);

      return {
        ...subject,
        profesorName: profesor?.name ?? 'Sin asignar',
      };
    });
  }
);

export const selectClassCountForSubject = (userId: number, subjectId: number) =>
  createSelector(selectScheduleByUserId(userId), (schedule) => {
    if (!schedule) return 0;
    return schedule.blocks.filter(
      (scheduleBlock) => scheduleBlock.subjectId === subjectId
    ).length;
  });
