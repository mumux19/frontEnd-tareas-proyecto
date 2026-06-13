import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskResponse, TaskRequest } from '../tasks/models/task.model';
import { TaskService } from '../tasks/task.service';
import { ProjectService } from '../projects/services/project.service';
import { Project } from '../projects/models/project.model';
import { forkJoin } from 'rxjs';

const MOCK_PROJECTS: Project[] = [
  { id: 1, name: 'Rediseño de Portal UX', startDate: '2026-06-01', endDate: '2026-06-30', status: 'ACTIVE', description: 'Renovar la interfaz de usuario del portal corporativo.' },
  { id: 2, name: 'API Spring Boot Integrada', startDate: '2026-05-15', endDate: '2026-07-15', status: 'ACTIVE', description: 'Desarrollar y conectar el core del backend con el frontend.' },
  { id: 3, name: 'Campaña de Lanzamiento', startDate: '2026-07-01', endDate: '2026-08-31', status: 'PLANNED', description: 'Estrategia de mercadeo y branding.' },
  { id: 4, name: 'Auditoría de Seguridad', startDate: '2026-04-10', endDate: '2026-05-10', status: 'CLOSED', description: 'Revisión y parches del sistema de autenticación.' }
];

const MOCK_TASKS: TaskResponse[] = [
  { id: 101, title: 'Definir paleta de colores y estilos CSS', estimateHours: 8, assignee: 'Carlos UX', status: 'IN_PROGRESS', project: { id: 1 } },
  { id: 102, title: 'Crear componentes Angular Standalone', estimateHours: 12, assignee: 'Sofía Dev', status: 'DONE', project: { id: 1 } },
  { id: 103, title: 'Configurar endpoints REST para proyectos', estimateHours: 16, assignee: 'Gabriel Java', status: 'IN_PROGRESS', project: { id: 2 } },
  { id: 104, title: 'Escribir pruebas unitarias del Frontend', estimateHours: 6, assignee: 'Lucía QA', status: 'TODO', project: { id: 1 } },
  { id: 105, title: 'Optimizar imágenes y recursos web', estimateHours: 4, assignee: 'Carlos UX', status: 'TODO', project: { id: 3 } }
];

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
  actionMessage = signal<{ text: string, type: 'error' | 'success' } | null>(null);
  activeTab = signal<'projects' | 'tasks'>('projects');

  private messageTimeoutId: any;

  // Indicador de modo offline / demo
  isDemoMode = signal<boolean>(false);

  // --- SIGNALS COMPUTADAS PARA ESTADÍSTICAS ---
  totalProjects = computed(() => this.projects().length);

  activeProjectsCount = computed(() =>
    this.projects().filter(p => p.status === 'ACTIVE').length
  );

  pendingTasksCount = computed(() =>
    this.tasks().filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS').length
  );

  totalHours = computed(() =>
    this.tasks().reduce((acc, t) => acc + (t.estimateHours || 0), 0)
  );

  completionProgress = computed(() => {
    const total = this.tasks().length;
    if (total === 0) return 0;
    const completed = this.tasks().filter(t => t.status === 'DONE').length;
    return Math.round((completed / total) * 100);
  });

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      projects: this.projectService.getProjects(),
      tasks: this.taskService.getTasks()
    }).subscribe({
      next: ({ projects, tasks }) => {
        this.projects.set(projects);
        this.tasks.set(tasks);
        this.isDemoMode.set(false);
        this.loading.set(false);
      },
      error: (err) => {
        console.warn('Backend API no disponible. Activando resiliencia con datos simulados locales.', err);
        // Resiliencia visual: cargamos mocks si no hay backend levantado
        this.projects.set(MOCK_PROJECTS);
        this.tasks.set(MOCK_TASKS);
        this.isDemoMode.set(true);
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
      case 'TODO': return 'Por hacer';
      case 'IN_PROGRESS': return 'En progreso';
      case 'DONE': return 'Terminado';
      case 'ACTIVE': return 'Activo';
      case 'PLANNED': return 'Planificado';
      case 'CLOSED': return 'Cerrado';
      default: return status;
    }
  }

  // Retorna una clase de color basada en el estado para un punto indicador
  getStatusIndicatorClass(status: string): string {
    switch (status) {
      case 'TODO': return 'indicator-todo';
      case 'PLANNED': return 'indicator-todo';
      case 'IN_PROGRESS': return 'indicator-progress';
      case 'ACTIVE': return 'indicator-progress';
      case 'DONE': return 'indicator-done';
      case 'CLOSED': return 'indicator-done';
      default: return 'indicator-todo';
    }
  }

  // Retorna un color de gradiente de avatar de acuerdo a la inicial
  getAvatarGradient(name: string): string {
    if (!name) return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    const firstLetter = name.charAt(0).toUpperCase();
    const charCode = firstLetter.charCodeAt(0);

    if (charCode < 69) { // A-D
      return 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'; // Rosado-Rojo
    } else if (charCode < 74) { // E-I
      return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'; // Azul
    } else if (charCode < 79) { // J-N
      return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; // Esmeralda
    } else if (charCode < 84) { // O-S
      return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'; // Ambar
    } else { // T-Z
      return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'; // Violeta
    }
  }

  onDeleteProject(id: number | null): void {
    if (id === null) return;

    const confirmacion = confirm('¿Estás seguro de que querés eliminar este proyecto?');
    if (!confirmacion) return;

    if (this.isDemoMode()) {
      this.projects.update(projects => projects.filter(p => p.id !== id));
      return;
    }

    this.projectService.deleteProject(id).subscribe({
      next: () => {
        this.projects.update(projects => projects.filter(p => p.id !== id));
        this.showTemporaryMessage("Proyecto eliminado con éxito.", "success", 3000);
      },
      error: (err) => {
        console.error('Error al borrar el proyecto', err);

        if (err.status === 409) {
          this.actionMessage.set({ text: 'No se puede eliminar el proyecto porque aún tiene tareas asignadas.', type: 'error' });
        } else {
          this.actionMessage.set({ text: 'No se pudo conectar al servidor para eliminar el proyecto.', type: 'error' });
        }
        // Se borra solo después de 5 segundos
        setTimeout(() => this.actionMessage.set(null), 5000);
      }
    });
  }
  onDeleteTask(id: number): void {
    if (this.isDemoMode()) {

      this.tasks.update(tasks => tasks.filter(t => t.id !== id));
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.update(tasks => tasks.filter(t => t.id !== id));
      },
      error: (err) => {
        console.error('Error al borrar la tarea', err);
      }
    });
  }

  onUpdateTaskStatus(task: TaskResponse, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value as 'TODO' | 'IN_PROGRESS' | 'DONE';

    // Optimistic UI update
    const previousStatus = task.status;
    this.tasks.update(tasks =>
      tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t)
    );

    if (this.isDemoMode()) return;

    // Call Backend
    const updateRequest: TaskRequest = {
      title: task.title,
      estimateHours: task.estimateHours,
      assignee: task.assignee,
      status: newStatus,
      project: { id: task.project.id }
    };

    this.taskService.updateTask(task.id, updateRequest).subscribe({
      next: () => {
        // Success, nothing to do since UI is already updated
      },
      error: (err) => {
        console.warn('Backend update failed. If PUT /tasks/{id} is not implemented, this is expected.', err);
        if (err.status === 404 || err.status === 405) return; // Keep local state to allow testing the UI

        // Revert UI update on unexpected error
        this.tasks.update(tasks =>
          tasks.map(t => t.id === task.id ? { ...t, status: previousStatus } : t)
        );
        target.value = previousStatus;
      }
    });
  }

  onToggleTaskCheckbox(task: TaskResponse, event: Event): void {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    const newStatus = isChecked ? 'DONE' : 'TODO';
    const previousStatus = task.status;

    this.tasks.update(tasks =>
      tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t)
    );

    if (this.isDemoMode()) return;

    const updateRequest: TaskRequest = {
      title: task.title,
      estimateHours: task.estimateHours,
      assignee: task.assignee,
      status: newStatus,
      project: { id: task.project.id }
    };

    this.taskService.updateTask(task.id, updateRequest).subscribe({
      next: () => { },
      error: (err) => {
        console.warn('Backend update failed. If PUT /tasks/{id} is not implemented, this is expected.', err);
        if (err.status === 404 || err.status === 405) return;

        this.tasks.update(tasks =>
          tasks.map(t => t.id === task.id ? { ...t, status: previousStatus } : t)
        );
        target.checked = !isChecked;
      }
    });
  }

  onUpdateProjectStatus(project: Project, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value as 'PLANNED' | 'ACTIVE' | 'CLOSED';
    const previousStatus = project.status;

    // Optimistic update
    this.projects.update(projects =>
      projects.map(p => p.id === project.id ? { ...p, status: newStatus } : p)
    );

    if (this.isDemoMode()) return;
    if (project.id === null) return;

    const updateRequest: Partial<Project> = {
      name: project.name,
      startDate: project.startDate,
      endDate: project.endDate,
      status: newStatus,
      description: project.description
    };

    this.projectService.updateProject(project.id, updateRequest).subscribe({
      next: () => { },
      error: (err) => {
        console.warn('Backend update failed. If PUT /projects/{id} is not implemented, this is expected.', err);
        if (err.status === 404 || err.status === 405) return; // Keep local state

        this.projects.update(projects =>
          projects.map(p => p.id === project.id ? { ...p, status: previousStatus } : p)
        );
        target.value = previousStatus;
      }
    });
  }

  private showTemporaryMessage(text: string, type: 'error' | 'success', duration: number): void {
    if (this.messageTimeoutId) {
      clearTimeout(this.messageTimeoutId);
    }

    this.actionMessage.set({ text, type });

    this.messageTimeoutId = setTimeout(() => {
      this.actionMessage.set(null);
      this.messageTimeoutId = null;
    }, duration);
  }


}