import { Routes } from '@angular/router';
import { CrearProyectoComponent } from './projects/crear-proyecto/crear-proyecto.component';
import { NewTaskComponent } from './tasks/new-task/new-task.component';

export const routes: Routes = [
  { path: 'projects/crear', component: CrearProyectoComponent },
  { path: 'nueva-tarea', component: NewTaskComponent },
  { path: '', redirectTo: 'projects/crear', pathMatch: 'full' }, // Redirigir a crear proyecto por defecto
  { path: '**', redirectTo: 'projects/crear' } // Manejo de rutas no encontradas
];
