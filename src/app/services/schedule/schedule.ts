import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/schedules';

  getByUser(userId: number) {
    return this.http.get<any[]>(`${this.base}/user/${userId}`);
  }

  create(dto: any) {
    return this.http.post(`${this.base}/create`, dto);
  }

  update(id: number, dto: any) {
    return this.http.patch(`${this.base}/edit/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/delete/${id}`);
  }
}
