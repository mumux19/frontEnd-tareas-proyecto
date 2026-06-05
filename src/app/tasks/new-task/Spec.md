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
**Escenario 1: Creación exitosa de una tarea**
- **dado** que el usuario completo los campos obligatorios del formulario con datos validos y selecciono un proyecto existente del menu desplegable
**Cuando** hace click al boton "Crear tarea".
**Entonces** el sistema realiza una peticion POST a '/task',muestra un mensaje de éxito en pantalla sin cambiar de ruta, y limpia los campos del formulario.

**Escenario 2: Validación de campos obligatorios**
* **Dado** que el usuario deja campos obligatorios vacíos o ingresa una estimación de horas inválida (menor a 1),
* **Cuando** intenta enviar el formulario,
* **Entonces** el sistema bloquea la acción, no realiza ninguna petición al backend y muestra mensajes de validación en la interfaz.
**Escenario 3: Manejo de errores del servidor**
* **Dado** que el usuario envía el formulario con datos, pero el servidor devuelve un error (ej. 400 Bad Request o 405),
* **Cuando** la respuesta de error es recibida por el frontend,
* **Entonces** el indicador de carga (spinner) se detiene y se muestra un mensaje de error claro en la interfaz indicando el problema.



**Escenario 4: Intento de agregar tarea a un proyecto cerrado (Error 409)**
**Dado** que el usuario selecciona del menú desplegable un proyecto que se encuentra en estado "CLOSED" y completa los demás datos,
**Cuando** envía el formulario para crear la tarea,
**Entonces** el backend responde con un código de error 409 (Conflict) y el frontend muestra un mensaje de advertencia claro indicando que no se pueden agregar tareas a un proyecto cerrado

### PROMT UTILIZADOS
Soy un desarrollador senior frontEnd con experiencia en Angular+17 y TypeScript, y con experiencia en aplicaciones web empresariales.
Contexto: Estoy desarrollando el frontend de una aplicación de gestión de Tareas y Proyectos. El backend es una API REST en Java (Spring Boot). Actualmente estoy trabajando en la feature "Crear una Nueva Tarea". La regla principal es que no puedo modificar absolutamente nada del backend, el frontend debe adaptarse a lo que la API expone. Lee los requisitos detallados en docs/crear-tarea/spec.md.
Feature a implementar: # Feature: Crear una Nueva Tarea
