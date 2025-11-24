import { inject, Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private API_URL = 'http://localhost:3000/';

  private http = inject(HttpClient);

  // GET all users: /users/create/all
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}users/all`);
  }

  // Login: no explicit /login endpoint provided, so fetch users and match credentials
  login(email: string, password: string): Observable<User | null> {
    return this.getUsers().pipe(
      map(
        (users) =>
          users.find((u) => u.email === email && u.password === password) ??
          null
      )
    );
  }

  // Register: POST /users/create
  register(data: {
    name: string;
    email: string;
    password: string;
  }): Observable<User> {
    // backend expects `nombre` instead of `name`
    const payload: any = {
      nombre: data.name,
      email: data.email,
      password: data.password,
    };
    return this.http.post<User>(`${this.API_URL}users/create`, payload);
  }

  // Admin: add new user via POST /users/create
  addNewUser(data: {
    name: string;
    email: string;
    password: string;
    role: 'estudiante' | 'profesor' | 'admin';
  }): Observable<User> {
    // accept either { name } or { nombre } coming from effects/components
    const nombre = (data as any).nombre ?? (data as any).name;
    const payload: any = {
      nombre,
      email: (data as any).email,
      password: (data as any).password,
      role: (data as any).role,
    };
    if (typeof (data as any).active !== 'undefined')
      payload.active = (data as any).active;
    return this.http.post<User>(`${this.API_URL}users/create`, payload);
  }

  // Update user: PATCH /users/edit/:id
  updateUser(user: User): Observable<User> {
    // Transform to backend field names
    const payload: any = {
      nombre: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      active: user.active,
    };
    return this.http.patch<User>(
      `${this.API_URL}users/edit/${user.id}`,
      payload
    );
  }

  // Delete user: DELETE /users/delete/:id
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}users/delete/${id}`);
  }

  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    return !!user;
  }
}
