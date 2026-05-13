import { Routes } from '@angular/router';
import { CrearProyectoComponent } from './projects/crear-proyecto/crear-proyecto.component';

export const routes: Routes = [
  { path: 'projects/crear', component: CrearProyectoComponent },
  { path: '', redirectTo: 'projects/crear', pathMatch: 'full' }, // Redirigir a crear proyecto por defecto
  { path: '**', redirectTo: 'projects/crear' } // Manejo de rutas no encontradas
];
