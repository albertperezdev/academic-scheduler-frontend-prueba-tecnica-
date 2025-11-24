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

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}users/all`);
  }

  login(email: string, password: string): Observable<User | null> {
    return this.getUsers().pipe(
      map(
        (users) =>
          users.find((u) => u.email === email && u.password === password) ??
          null
      )
    );
  }

  register(data: {
    name: string;
    email: string;
    password: string;
  }): Observable<User> {
    const payload: any = {
      nombre: data.name,
      email: data.email,
      password: data.password,
    };
    return this.http.post<User>(`${this.API_URL}users/create`, payload);
  }

  addNewUser(data: {
    name: string;
    email: string;
    password: string;
    role: 'estudiante' | 'profesor' | 'admin';
  }): Observable<User> {
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

  updateUser(user: User): Observable<User> {
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

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}users/delete/${id}`);
  }

  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    return !!user;
  }
}
