# Feature: Crear una Nueva Tarea

## Descripción General
El usuario puede agregar una nueva tarea a un proyecto existente. El formulario incluye: título, horas estimadas, persona asignada, estado y proyecto. El proyecto se selecciona desde un menú desplegable (dropdown) cargado dinámicamente desde el backend.

---

## Endpoints

- **GET** `/projects`  
  Devuelve la lista de proyectos disponibles para el dropdown (usado por `ProjectService`).

- **POST** `/projects/{projectId}/tasks`  
  Crea una nueva tarea asociada al proyecto seleccionado (usado por `TaskService`).
  - **Request Body:**
    ```json
    {
      "title": "Create landing page",
      "estimateHours": 12,
      "assignee": "alice",
      "status": "TODO"
    }
    ```
  - **Respuestas:**
    - `201 Created`: tarea creada correctamente
    - `400 Bad Request`: datos inválidos (ej. horas negativas o título vacío)
    - `404 Not Found`: el proyecto no existe
    - `409 Conflict`: no se puede agregar una tarea a un proyecto en estado CLOSED

---

## Lineamientos Técnicos (Frontend)

- **Componente:** Angular Standalone Component.
- **Estilos:** Bootstrap 5 (formularios, validaciones visuales, botones).
- **Ruta:** `/nueva-tarea` (estática, sin parámetros).
- **Selector de Proyecto:**  
  El usuario debe elegir el proyecto desde un `<select>` (dropdown) en el formulario.  
  La lista de proyectos se obtiene usando `ProjectService` (`GET /projects`).
- **Comunicación:**  
  - `ProjectService` para obtener proyectos reales del backend.
  - `TaskService` para crear la tarea usando `POST /projects/{projectId}/tasks`.
- **Estados y feedback:**  
  - loading (botón deshabilitado mostrando spinner)
  - error (mensajes rojos bajo los inputs o alertas generales)
  - éxito (feedback visual de tarea creada, sin redirección)
- **Manejo de errores HTTP:**  
  - 400 Bad Request (datos inválidos)
  - 404 Not Found (si el projectId seleccionado no existe)
  - 409 Conflict (si se intenta agregar a un proyecto en estado CLOSED)

---

## Validaciones (Frontend)

- `projectId`: requerido (debe seleccionarse un proyecto válido)
- `title`: requerido
- `estimateHours`: requerido y valor mínimo de 1
- `status`: requerido (valores permitidos: TODO, IN_PROGRESS, DONE)

---

## Criterios de Aceptación

- Cuando el usuario selecciona un proyecto y completa datos válidos, el sistema hace el POST y muestra un mensaje de éxito.
- Si el usuario pone 0 o un número negativo en horas, el botón se bloquea y muestra error visual.
- Si el proyecto está CLOSED, el backend devuelve 409 y el frontend muestra un mensaje claro al usuario.
- No debe haber redirección tras la creación exitosa, solo feedback visual.