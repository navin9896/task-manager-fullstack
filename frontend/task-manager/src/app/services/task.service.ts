import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateTaskPayload, Task, UpdateTaskPayload } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly endpoint = `${environment.apiBaseUrl}/tasks`;

  constructor(private readonly http: HttpClient) {}

  getTasks(filter: 'all' | 'pending' | 'completed' = 'all'): Observable<Task[]> {
    let params = new HttpParams();
    if (filter !== 'all') params = params.set('status', filter);

    return this.http.get<Task[]>(this.endpoint, { params }).pipe(
      catchError((error) => this.handleError(error, 'Failed to load tasks.'))
    );
  }

  createTask(payload: CreateTaskPayload): Observable<Task> {
    return this.http.post<Task>(this.endpoint, payload).pipe(
      catchError((error) => this.handleError(error, 'Failed to create task.'))
    );
  }

  updateTask(taskId: string, payload: UpdateTaskPayload): Observable<Task> {
    return this.http.put<Task>(`${this.endpoint}/${taskId}`, payload).pipe(
      catchError((error) => this.handleError(error, 'Failed to update task.'))
    );
  }

  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${taskId}`).pipe(
      catchError((error) => this.handleError(error, 'Failed to delete task.'))
    );
  }

  private handleError(error: unknown, fallbackMessage: string): Observable<never> {
    const serverMessage =
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      typeof (error as { error?: { message?: string } }).error?.message === 'string'
        ? (error as { error: { message: string } }).error.message
        : fallbackMessage;

    return throwError(() => new Error(serverMessage));
  }
}

