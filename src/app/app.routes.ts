import { Routes } from '@angular/router';
import { CrearProyectoComponent } from './projects/crear-proyecto/crear-proyecto.component';
import { NewTaskComponent } from './tasks/new-task/new-task.component';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'projects/crear', component: CrearProyectoComponent },
  { path: 'nueva-tarea', component: NewTaskComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
