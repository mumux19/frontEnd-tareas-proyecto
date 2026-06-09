import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskResponse } from '../tasks/models/task.model';
import { TaskService } from '../tasks/task.service';
import { ProjectService } from '../projects/services/project.service';
import { Project } from '../projects/models/project.model';

import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  tasks = signal<TaskResponse[]>([]);
  projects = signal<Project[]>([]);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  activeTab = signal<'projects' | 'tasks'>('projects');


  constructor(
    private taskService: TaskService,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.loading.set(true);

    forkJoin({
      projects: this.projectService.getProjects(),
      tasks: this.taskService.getTasks()
    }).subscribe({
      next: ({ projects, tasks }) => {
        this.projects.set(projects);
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar al servidor. Intentá de nuevo.');
        this.loading.set(false);
      }
    });

  }



  // Busca el ID del proyecto en nuestra lista y devuelve el nombre
  getProjectName(idProyecto: number | undefined): string {
    if (!idProyecto) return 'Sin proyecto';

    // Busca en la lista de proyectos que ya tenemos guardada en la Signal
    const proyectoEncontrado = this.projects().find(p => p.id === idProyecto);

    return proyectoEncontrado ? proyectoEncontrado.name : 'Proyecto Desconocido';
  }

  getNotionBadge(status: string): string {
    switch (status) {
      case 'TODO': return 'notion-badge-todo';
      case 'IN_PROGRESS': return 'notion-badge-inprogress';
      case 'DONE': return 'notion-badge-done';
      case 'ACTIVE': return 'notion-badge-inprogress';
      case 'PLANNED': return 'notion-badge-todo';
      case 'CLOSED': return 'notion-badge-done';
      default: return 'badge bg-light text-dark';
    }
  }

  translateStatus(status: string): string {
    switch (status) {
      case 'TODO': return 'Sin empezar';
      case 'IN_PROGRESS': return 'En progreso';
      case 'DONE': return 'Hecho';
      case 'ACTIVE': return 'Activo';
      case 'PLANNED': return 'Planificado';
      case 'CLOSED': return 'Cerrado';
      default: return status;
    }
  }
}