import { Injectable, inject } from '@angular/core';
import { Subject } from '../../state/subjects/subjects.models';
import { ScheduleBlock } from '../../state/schedule/schedule.models';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  days: Array<ScheduleBlock['day']> = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
  ];

  private API_URL = 'http://localhost:3000/';
  private http = inject(HttpClient);

  private subjects: Subject[] = [];

  constructor() {
    this.fetchAll().subscribe({ next: () => {}, error: () => {} });
  }

  getAll(): Subject[] {
    return [...this.subjects];
  }

  fetchAll(): Observable<Subject[]> {
    console.log('[SubjectsService] fetchAll ->', `${this.API_URL}subjects/all`);
    return this.http.get<any[]>(`${this.API_URL}subjects/all`).pipe(
      map((arr) =>
        (arr ?? []).map((subject) => ({
          id: subject.id,
          name: subject.nombre ?? subject.name,
          profesorId:
            subject.profesor_id ?? subject.profesorId ?? subject.profesor?.id,
          maxPerWeek: subject.max_clases ?? subject.maxPerWeek ?? 1,
        }))
      ),
      tap((s) => (this.subjects = s ?? []))
    );
  }

  add(subject: Subject): Observable<Subject> {
    const payload: any = {
      nombre: subject.name,
      profesor_id: subject.profesorId,
      profesorId: subject.profesorId,
      max_clases: subject.maxPerWeek,
    };
    const url = `${this.API_URL}subjects/create`;
    console.log('[SubjectsService] POST', url, payload);

    return this.http.post<any>(url, payload).pipe(
      map((subject) => ({
        id: subject.id,
        name: subject.nombre ?? subject.name,
        profesorId:
          subject.profesor_id ?? subject.profesorId ?? subject.profesor?.id,
        maxPerWeek: subject.max_clases ?? subject.maxPerWeek ?? 1,
      })),
      tap((subject) => {
        console.log('[SubjectsService] created ->', subject);
        this.subjects.push(subject);
      })
    );
  }

  update(subject: Subject): Observable<Subject> {
    const payload: any = {};
    if (typeof subject.name !== 'undefined') payload.nombre = subject.name;
    if (typeof subject.profesorId !== 'undefined')
      payload.profesor_id = subject.profesorId;
    if (typeof subject.maxPerWeek !== 'undefined')
      payload.max_clases = subject.maxPerWeek;

    const url = `${this.API_URL}subjects/actualizar/${subject.id}`;
    console.log('[SubjectsService] PATCH', url, payload);

    return this.http.patch<any>(url, payload).pipe(
      map((b) => ({
        id: b.id,
        name: b.nombre ?? b.name,
        profesorId: b.profesor_id ?? b.profesorId ?? b.profesor?.id,
        maxPerWeek: b.max_clases ?? b.maxPerWeek ?? 1,
      })),
      tap((subject) => {
        const index = this.subjects.findIndex(
          (subject) => subject.id === subject.id
        );
        if (index !== -1) this.subjects[index] = subject;
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}subjects/delete/${id}`)
      .pipe(
        tap(() => (this.subjects = this.subjects.filter((s) => s.id !== id)))
      );
  }

  findByProfesorId(profesorId: number): Subject[] {
    return this.subjects.filter((subject) => subject.profesorId === profesorId);
  }

  findById(id: number): Subject | undefined {
    return this.subjects.find((subject) => subject.id === id);
  }
}
