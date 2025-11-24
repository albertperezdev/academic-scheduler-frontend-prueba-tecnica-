import { EntityState } from '@ngrx/entity';

export interface Subject {
  id: number;
  name: string;
  profesorId: number;
  maxPerWeek: number;
}

export interface SubjectState extends EntityState<Subject> {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}
