import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { TaskRequest } from '../models/task.model';
import { HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  projectId!: number;
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = Number(params.get('id'));
    });

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      estimateHours: [null, [Validators.required, Validators.min(1)]],
      assignee: [''],
      status: [null, Validators.required] // Default status, should be selectable
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

    const taskRequest: TaskRequest = this.taskForm.value;

    this.taskService.createTask(this.projectId, taskRequest).pipe(
      catchError(error => {
        console.error('Error creating task:', error);
        this.loading = false;
        if (error.status === 400) {
          this.errorMessage = 'Invalid data provided. Please check your inputs.';
        } else if (error.status === 404) {
          this.errorMessage = 'Project not found. The project ID might be incorrect.';
        } else if (error.status === 409) {
          this.errorMessage = 'Cannot add task to a closed project.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
        return of(null);
      })
    ).subscribe(response => {
      this.loading = false;
      if (response) {
        this.successMessage = 'Task created successfully!';
        // As per requirements, no redirection, just show success message.
        this.taskForm.reset({
          title: '',
          estimateHours: null,
          assignee: '',
          status: null
        });
      }
    });
  }

  // Helper for easy access to form fields
  get f() { return this.taskForm.controls; }

}
