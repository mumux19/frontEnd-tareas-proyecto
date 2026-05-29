import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../task.service';
import { TaskRequest } from '../models/task.model';
import { HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule // Needed for standalone components if HttpClient is used directly or via a service
  ],
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {
  taskForm!: FormGroup;
  projects: Project[] = [];
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      projectId: [null, Validators.required],
      title: ['', Validators.required],
      estimateHours: [null, [Validators.required, Validators.min(1)]],
      assignee: [''],
      status: [null, Validators.required]
    });
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.errorMessage = 'Failed to load projects.';
      }
    });
  }
  onSubmit(): void {
    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    if (this.taskForm.invalid) {
      this.errorMessage = 'Please correct the form errors.';
      this.loading = false;
      return;
    }

    const formValues = this.taskForm.value;
    const projectId = formValues.projectId;

    // Ahora metemos TODOS los datos juntos en el mismo objeto (incluyendo el projectId)
    const taskRequest: TaskRequest = {
     project: { id: Number(formValues.projectId) }, // ¡El ID viaja en el body!
      title: formValues.title,
      estimateHours: formValues.estimateHours,
      assignee: formValues.assignee,
      status: formValues.status
    };

    this.taskService.createTask(taskRequest).pipe(
      catchError(error => {
        console.error('Error creating task:', error);
        this.loading = false; // Esto apaga el botón que gira
        
        // Atrapamos los errores para mostrar el mensaje
        if (error.status === 400) {
          this.errorMessage = 'Datos inválidos. Por favor revisa el formulario.';
        } else if (error.status === 405) {
          this.errorMessage = 'Error de ruta en el servidor (405).';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado.';
        }
        return of(null);
      })
    ).subscribe(response => {
      this.loading = false; // Apaga el botón si todo sale bien
      if (response) {
        this.successMessage = '¡Tarea creada con éxito!';
        this.taskForm.reset();
      }
    });
  }

  // Helper for easy access to form fields
  get f() { return this.taskForm.controls; }

}
