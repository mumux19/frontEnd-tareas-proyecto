import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectService } from '../../services/project.service';
import { ProjectCreateRequest, ProjectStatus } from '../../models/project.model';

/** Cross-field validator: endDate >= startDate */
function endDateAfterStartDate(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value as string;
  const end = group.get('endDate')?.value as string;
  if (!start || !end) return null;
  return end >= start ? null : { endBeforeStart: true };
}

/** Validator: endDate must not be before today */
function endDateNotInPast(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  const today = new Date().toISOString().split('T')[0];
  return value >= today ? null : { endDateInPast: true };
}

@Component({
  selector: 'app-crear-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-proyecto.component.html',
  styleUrl: './crear-proyecto.component.css'
})
export class CrearProyectoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);

  // Signals para estado de UI
  readonly isSaving = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly statusOptions: ProjectStatus[] = ['PLANNED', 'ACTIVE', 'CLOSED'];

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.maxLength(100)]],
        startDate: ['', Validators.required],
        endDate: ['', [Validators.required, endDateNotInPast]],
        status: ['', Validators.required],
        description: ['', Validators.maxLength(500)]
      },
      { validators: endDateAfterStartDate }
    );
  }

  /** Helpers de acceso a controles */
  get nameCtrl() { return this.form.get('name')!; }
  get startDateCtrl() { return this.form.get('startDate')!; }
  get endDateCtrl() { return this.form.get('endDate')!; }
  get statusCtrl() { return this.form.get('status')!; }
  get descriptionCtrl() { return this.form.get('description')!; }

  /** Indica si el endDate tiene error cruzado (endDate < startDate) */
  get hasEndBeforeStartError(): boolean {
    return this.form.hasError('endBeforeStart') &&
           (this.endDateCtrl.dirty || this.endDateCtrl.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const payload: ProjectCreateRequest = {
      id: null,
      name: this.nameCtrl.value.trim(),
      startDate: this.startDateCtrl.value,
      endDate: this.endDateCtrl.value,
      status: this.statusCtrl.value,
      description: this.descriptionCtrl.value?.trim() ?? ''
    };

    this.projectService.createProject(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set('¡Proyecto creado exitosamente!');
        setTimeout(() => this.router.navigate(['/projects']), 2000);
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving.set(false);
        if (err.status === 409) {
          this.errorMessage.set('Ya existe un proyecto con ese nombre. Por favor, elige otro nombre.');
        } else if (err.status === 400) {
          this.errorMessage.set('Los datos ingresados no son válidos. Revisá el formulario.');
        } else {
          this.errorMessage.set('Ocurrió un error inesperado. Intentá nuevamente más tarde.');
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/projects']);
  }

  /** Indica si un control tiene error y fue tocado/modificado */
  isInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
