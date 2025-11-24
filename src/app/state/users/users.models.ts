import { EntityState } from '@ngrx/entity';

export interface User {
  id: number;
  email: string;
  password: string;
  role: 'estudiante' | 'profesor' | 'admin';
  name: string;
  active: boolean;
}

export interface UsersState extends EntityState<User> {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}
