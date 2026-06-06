import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskRequest, TaskResponse } from './models/task.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createTask(task: TaskRequest): Observable<TaskResponse> {
    // IMPORTANTE: Fijate si tu backend es /task o /tasks y cambialo acá si hace falta
    return this.http.post<TaskResponse>(`${this.apiUrl}/tasks`, task); 
  }

  getTasks(): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(`${this.apiUrl}/tasks`);
  }
}
