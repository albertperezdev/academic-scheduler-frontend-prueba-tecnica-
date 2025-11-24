import { createReducer, on } from '@ngrx/store';
import { scheduleAdapter } from './schedule.adapter';
import { ScheduleState } from './schedule.models';
import { ScheduleActions } from './schedule.actions';

export const initialState: ScheduleState = scheduleAdapter.getInitialState({
  loaded: false,
  loading: false,
  error: null,
});

export const scheduleReducer = createReducer(
  initialState,

  on(ScheduleActions.load, (state) => ({
    ...state,
    loading: true,
  })),

  on(ScheduleActions.loadSuccess, (state, { schedule }) =>
    scheduleAdapter.setAll(schedule, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    })
  ),

  on(ScheduleActions.addSuccess, (state, { schedule }) =>
    scheduleAdapter.upsertOne(schedule, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    ScheduleActions.loadFailure,
    ScheduleActions.addFailure,
    ScheduleActions.editFailure,
    ScheduleActions.deleteFailure,
    (state, { error }) => ({ ...state, loading: false, error })
  )
);
