# Feature: Crear una Nueva Tarea

## Descripción general
El usuario puede agregar una nueva tarea a un proyecto existente. Debe completar un formulario con el título, horas estimadas, persona asignada y estado. 

## Endpoints involucrados
* **POST** `/projects/{projectId}/tasks`
* **Request Body:** ```json
  {
    "id": null,
    "title": "Create landing page",
    "estimateHours": 12,
    "assignee": "alice",
    "status": "TODO"
  }
  Response:

201 Created → tarea creada correctamente
400 Bad Request → datos inválidos(ej.horas negativas o titulo vacio)
404 Not Found → proyecto no existe
409 Conflict → regla de negocio violada como intentar agregar una tarea a un proyecto CLOSED

### Restricciones de negocio (Backend)
-title es obligatorio.
-estimateHours debe ser mayor a 0.
-status solo puede ser: TODO, IN_PROGRESS, DONE.
-No se puede agregar una tarea a un proyecto que tenga estado CLOSED.

#### Lineamientos técnicos (Frontend)
## Lineamientos técnicos
- **Componente:** Angular Standalone Component.
- **Estilos:** Bootstrap 5 (Formularios, validaciones visuales, botones).
- **Ruta:** El componente debe capturar el `projectId` desde la URL (ejemplo: `/proyectos/:id/nueva-tarea`) usando `ActivatedRoute`.
- **Comunicación:** Crear/Actualizar un `TaskService` usando HttpClient apuntando a `${environment.apiUrl}/projects/${projectId}/tasks`.

**Validaciones en frontend (Reactive Forms):**
- `title`: requerido.
- `estimateHours`: requerido y valor mínimo de 1.
- `status`: requerido.

**Manejo de estados (Signals o variables):**
- loading (botón deshabilitado mostrando un spinner).
- error (mensajes rojos bajo los inputs o alertas generales).
- éxito (feedback visual de tarea creada).

**Flujo y manejo de errores:**
- Redirección al detalle del proyecto (o listado de tareas de ese proyecto) luego de una creación exitosa.
- Manejo de errores HTTP:
  - 400 Bad Request (datos inválidos).
  - 404 Not Found (si el projectId de la URL no existe en el backend).
  - 409 Conflict (si se intenta agregar a un proyecto en estado CLOSED).
##### Criterios de aceptación
Dado que el usuario ingresa a crear una tarea, cuando envía datos válidos, entonces el sistema hace el POST con el projectId en la URL, recibe un 201 y muestra un éxito.

Dado que el usuario pone 0 o un número negativo en horas, cuando intenta enviar, entonces el botón se bloquea y muestra error visual.

Dado que el proyecto está CLOSED, cuando se intenta crear la tarea, entonces el backend devuelve 409 y el frontend muestra un mensaje claro al usuario