import { EntityState } from '@ngrx/entity';

export interface ScheduleBlock {
  id: number;
  day: string;
  name: string;
  startTime: string;
  endTime: string;
  subjectId: number;
}

export interface Schedule {
  id: number;
  userId: number;
  blocks: ScheduleBlock[];
}

export interface ScheduleState extends EntityState<Schedule> {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}
