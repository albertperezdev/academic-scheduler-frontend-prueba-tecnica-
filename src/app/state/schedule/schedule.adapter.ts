import { createEntityAdapter } from '@ngrx/entity';
import { Schedule } from './schedule.models';

export const scheduleAdapter = createEntityAdapter<Schedule>({
  selectId: (schedule) => schedule.id,
});
