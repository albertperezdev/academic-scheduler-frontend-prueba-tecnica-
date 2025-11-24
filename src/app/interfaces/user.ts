export interface User {
  id: number;
  email: string;
  password: string;
  role: 'estudiante' | 'profesor' | 'admin';
  name: string;
  active: boolean;
}
