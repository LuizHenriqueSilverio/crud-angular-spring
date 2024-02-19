import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, first } from 'rxjs';

import { Course } from '../model/course';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = 'api/courses';

  constructor(private httpClient : HttpClient) { }

  listAll(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(this.API)
    .pipe(
      first()
    );
  }

  loadById(id: string): Observable<Course> {
    return this.httpClient.get<Course>(`${this.API}/${id}`);
  }

  save(record: Partial<Course>): Observable<Course> {
    if(record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  remove(id: string): Observable<Object> {
    return this.httpClient.delete(`${this.API}/${id}`).pipe(first());
  }

  private create(record: Partial<Course>): Observable<Course> {
    return this.httpClient.post<Course>(this.API, record).pipe(first());
  }

  private update(record: Partial<Course>): Observable<Course> {
    return this.httpClient.put<Course>(`${this.API}/${record._id}`, record).pipe(first());
  }
}
