import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskResponse } from '../tasks/models/task.model'; // Tu modelo real
// Importá el modelo de tu proyecto (puede que se llame Project o ProjectResponse)
import { TaskService } from '../tasks/task.service';
import { ProjectService } from '../projects/services/project.service';
import { Project } from '../projects/models/project.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // 1. Inicializamos las Signals completamente vacías
  tasks = signal<TaskResponse[]>([]);
  projects = signal<Project[]>([]);

  loading = signal<boolean>(true);
  activeTab = signal<'projects' | 'tasks'>('projects');

  // 2. Inyectamos los DOS servicios
  constructor(
    private taskService: TaskService,
    private projectService: ProjectService
  ) { }

  // 3. Cuando el componente se carga, disparamos las peticiones a la BD
  ngOnInit(): void {
    this.loadProjects();
    this.loadTasks();
  }

  loadProjects(): void {
    // Asegurate de que el método en tu servicio se llame así (o cambialo por el tuyo)
    this.projectService.getProjects().subscribe({
      next: (data) => {
        console.log("Estas son mi tareas:", data);
        this.projects.set(data); // Llenamos la Signal con los datos reales!
      },
      error: (err) => {
        console.error('Error al traer proyectos del backend:', err);
      }
    });
  }

  loadTasks(): void {
    // Asegurate de que el método en tu servicio se llame así
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data); // Llenamos la Signal con las tareas reales!
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al traer tareas del backend:', err);
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

  // --- MÉTODOS DE ESTILOS (Los dejamos igual) ---
  getNotionBadge(status: string): string {
    switch (status) {
      case 'TODO': return 'notion-badge-todo';
      case 'IN_PROGRESS': return 'notion-badge-inprogress';
      case 'DONE': return 'notion-badge-done';
      case 'ACTIVE': return 'notion-badge-inprogress'; // Por si los proyectos usan ACTIVE
      case 'PLANNED': return 'notion-badge-todo';      // Por si los proyectos usan PLANNED
      case 'CLOSED': return 'notion-badge-done';       // Por si los proyectos usan CLOSED
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