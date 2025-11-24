import { createActionGroup, props } from '@ngrx/store';
import { Schedule, ScheduleBlock } from './schedule.models';

export const ScheduleActions = createActionGroup({
  source: 'Schedule',
  events: {
    Load: props<{ userId: number }>(),
    'Load Success': props<{ schedule: Schedule[] }>(),
    'Load Failure': props<{ error: string }>(),

    AddClass: props<{ block: ScheduleBlock }>(),
    'Add Success': props<{ schedule: Schedule }>(),
    'Add Failure': props<{ error: string }>(),

    EditClass: props<{ index: number; block: ScheduleBlock }>(),
    'Edit Failure': props<{ error: string }>(),

    RemoveClass: props<{ index: number }>(),
    'Delete Failure': props<{ error: string }>(),
  },
});
