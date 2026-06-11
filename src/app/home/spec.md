# Feature: Layout Principal y Dashboard (Home)

## Descripción general
El usuario interactuará con un diseño tipo "Admin Dashboard" (Shell Layout) que incluye una barra lateral oscura (Sidebar) de navegación fija y una barra superior (Topbar) con acciones principales. Además, se implementa la pantalla de inicio (`HomeComponent`) que actúa como un panel general mostrando una lista de todas las tareas del sistema.

## Endpoints involucrados
* **GET** `/tasks`
* **Response:**
  200 OK → Retorna `List<Task>` (lista de tareas mapeadas)
  200 OK → Retorna `[]` (lista vacía si no hay tareas, no debe romper el front)

## Restricciones de negocio
* El diseño debe integrarse sin afectar ni romper los formularios de creación existentes (`CrearProyecto` y `NewTask`).
* El Sidebar debe tener un ancho fijo y permitir la navegación fluida entre módulos.
* Los estados de las tareas en el Dashboard deben visualizarse con colores representativos (TODO = gris, IN_PROGRESS = amarillo/azul, CLOSED = verde).

## Lineamientos técnicos
* **Componentes:** Angular Standalone Components (`AppComponent` para el Layout, `HomeComponent` para el panel).
* **Estilos:** Bootstrap 5 nativo y clases de utilidad (Flexbox `vh-100`, `overflow-hidden`, `bg-dark`, `rounded-pill` para los badges de estado).
* **Enrutamiento:** Configuración en `app.routes.ts` (`/home`, `/proyectos/nuevo`, `/tareas/nueva`).
* **Comunicación:** Inyectar `TaskService` utilizando `HttpClient` para consumir el endpoint GET.
* **Estado:** Uso de Signals para manejar la lista de `tasks` y el estado de `loading`.
* **Resiliencia Frontend:** Si el backend falla o el endpoint no está disponible, el componente debe cargar un array estático (mock) de 3 tareas para garantizar la visualización del diseño.

## Criterios de aceptación
* **Dado** que el usuario ingresa a la aplicación, **cuando** carga la pantalla principal, **entonces** visualiza el Sidebar fijo a la izquierda y el Topbar arriba, con el contenido renderizado dinámicamente en el centro.
* **Dado** que el usuario está en el Layout, **cuando** hace clic en "Proyectos" o "Tareas" en el Sidebar, **entonces** el enlace activo se resalta y el componente correspondiente se carga sin recargar la página.
* **Dado** que el usuario ingresa a `/home`, **cuando** se inicializa el componente, **entonces** el sistema hace un GET a `/tasks` y dibuja las tarjetas/filas de la tabla con la información correspondiente.

## PROMPTS UTILIZADOS
Soy un desarrollador senior frontEnd con experiencia en Angular+17 y TypeScript, y con experiencia en aplicaciones web eqmpresariales.
Contexto: Estoy desarrollando el frontend de una aplicación de gestión de Tareas y Proyectos. El backend es una API REST en Java (Spring Boot). Actualmente estoy trabajando en la feature "Layout Principal y Dashboard". La regla principal es que no puedo modificar los formularios existentes, debo crear un "Shell" que los envuelva.

Restricciones técnicas:
- Usar Angular standalone components
- Estructura Flexbox con Bootstrap 5
- Configurar app.routes.ts
- Inyectar TaskService y consumir HttpClient
- Implementar mock temporal en caso de error HTTP

Generar:
- Layout en app.component (Sidebar y Topbar)
- Configuración de rutas
- HomeComponent (Standalone) con tabla/lista de tareas usando Bootstrap
