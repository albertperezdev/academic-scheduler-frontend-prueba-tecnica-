import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Subject } from './subjects.models';

export const SubjectsActions = createActionGroup({
  source: 'Subjects',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ subjects: Subject[] }>(),
    'Load Failure': props<{ error: string }>(),

    Create: props<{ subject: Omit<Subject, 'id'> }>(),

    Update: props<{ subject: Subject }>(),
    Delete: props<{ id: number }>(),
  },
});
