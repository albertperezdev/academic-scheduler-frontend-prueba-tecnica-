export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'estudiante' | 'profesor' | 'admin';
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}
