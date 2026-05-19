# Tareas de Implementación: Crear Tarea

- [ ] 1. Crear el modelo/interfaz `TaskRequest` y `TaskResponse`.
- [ ] 2. Crear `TaskService` con el método POST apuntando a `${environment.apiUrl}/projects/${projectId}/tasks`.
- [ ] 3. Crear componente standalone `CrearTarea`.
- [ ] 4. Configurar el enrutamiento para que acepte el ID del proyecto (ej: `path: 'proyectos/:id/nueva-tarea'`).
- [ ] 5. En el componente, inyectar `ActivatedRoute` para capturar el `projectId` de la URL.
- [ ] 6. Crear el Reactive Form con validadores (`Validators.required`, `Validators.min(1)` para las horas).
- [ ] 7. Maquetar el formulario con Bootstrap 5 y mostrar mensajes de error debajo de cada input.
- [ ] 8. Implementar el submit manejando los estados de carga (loading) y los errores 409/400.