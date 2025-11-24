import { createReducer, on } from '@ngrx/store';
import { SubjectsActions } from './subjects.actions';
import { SubjectState } from './subjects.models';
import { subjectAdapter } from './subjects.adapter';

export const initialState: SubjectState = subjectAdapter.getInitialState({
  loaded: false,
  loading: false,
  error: null,
});

export const subjectsReducer = createReducer(
  initialState,

  on(SubjectsActions.load, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SubjectsActions.loadSuccess, (state, { subjects }) =>
    subjectAdapter.setAll(subjects, {
      ...state,
      loaded: true,
      loading: false,
    })
  ),

  on(SubjectsActions.loadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
