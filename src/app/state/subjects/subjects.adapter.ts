import { createEntityAdapter } from '@ngrx/entity';
import { Subject } from './subjects.models';

export const subjectAdapter = createEntityAdapter<Subject>({
  selectId: (subject) => subject.id,
});
