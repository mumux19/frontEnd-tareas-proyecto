# Feature: Borrar Proyecto

## Descripción general
El usuario interactuará con el botón de acción (icono de papelera/tachito) incorporado en la lista de proyectos del panel de control (`HomeComponent`). Al hacer clic en dicho botón, el sistema solicitará una confirmación nativa al usuario y procederá a eliminar el proyecto en el servidor, El resultado de la acción se manejará de forma reactiva, actualizando la tabla sin recargar la página y mostrando notificaciones visuales (alertas) no bloqueantes.

## Endpoints involucrados
* **DELETE** `/projects/{id}`
* **Response:**
  200 OK / 204 No Content → Retorna éxito de la eliminación.
  400 Bad Request / 500 Internal Server Error → Retorna un error que debe ser capturado por el frontend sin romper la aplicación.

## Restricciones de negocio
* No se debe eliminar el proyecto de manera inmediata; es obligatorio lanzar un cuadro de confirmación nativo (`confirm`) para evitar borrados accidentales.
* Al confirmar la eliminación y recibir una respuesta exitosa, el proyecto debe desaparecer instantáneamente de la tabla actual para mantener la fluidez de la interfaz.
* En caso de fallo en la comunicación o error en el borrado, el proyecto debe permanecer visible en la tabla y se debe alertar visualmente al usuario.
* No se permite borrar proyectos que contengan tareas. En lugar de validarlo localmente, se dependerá exclusivamente de la respuesta del backend. Si el backend devuelve un código HTTP `409 Conflict`, el frontend debe atraparlo y mostrar una notificación visual (no un alert nativo) con el mensaje: *"No se puede eliminar el proyecto porque aún tiene tareas asignadas"*.."

## Lineamientos técnicos
* **Componentes y Servicios:** Modificación de `ProjectService` para añadir la petición HTTP DELETE y de `HomeComponent` para gestionar la acción y la actualización del estado.
* **Comunicación:** Inyectar el método `deleteProject(id: number)` en `ProjectService` utilizando `HttpClient` apuntando a `${this.apiUrl}/projects/${id}`.
* **Estado:** Uso de Angular Signals. Se debe utilizar el método `.update()` sobre la señal `projects` para filtrar y remover el proyecto eliminado localmente, garantizando reactividad inmediata.
* **Resiliencia Frontend:** Si el backend falla o la petición es rechazada, se debe atrapar la excepción en el bloque `error` de la suscripción y actualizar la señal `error` con el mensaje: "No se pudo eliminar el proyecto. Intentá de nuevo.", reutilizando el componente de alertas visuales ya existente en el template.


## Criterios de aceptación
* **Dado** que el usuario se encuentra en la pestaña "Proyectos", 
**cuando** hace clic en el icono de papelera de un proyecto,
 **entonces** se despliega una alerta nativa preguntando "¿Estás seguro de que querés eliminar este proyecto?".
* 
**Dado** que el cuadro de confirmación está abierto, 
**cuando** el usuario hace clic en "Cancelar", 
**entonces** la acción se interrumpe silenciosamente.
* 
**Dado** que el usuario hace clic en "Aceptar", 
**cuando** el servicio responde exitosamente (`204`), 
**entonces** la fila del proyecto desaparece reactivamente y se muestra un cartel verde indicando "Proyecto eliminado con éxito".
* **Dado** que se muestra un cartel verde de éxito, 
**cuando** transcurren exactamente 3 segundos, 
**entonces** el cartel desaparece automáticamente de la pantalla.

* **Dado** que el usuario hace clic en "Aceptar", 
**cuando** el servicio responde con un error `409 Conflict` debido a la existencia de tareas, 
**entonces** la fila del proyecto no se altera y se muestra un cartel rojo indicando el motivo de la restricción.

* **Dado** que se muestra un cartel rojo de error, 
**cuando** transcurren exactamente 5 segundos, 
**entonces** el cartel desaparece automáticamente de la pantalla.


## Prompts Utilizados

**1. Generación inicial de la funcionalidad:**
> "Quiero implementar el borrado de proyectos en mi HomeComponent. Cuando el usuario toque el tachito, se debe llamar al endpoint DELETE /projects/{id}. Quiero que salga un mensaje de confirmación antes de borrar. Si el backend tira un error porque el proyecto tiene tareas (devuelve un 409), quiero mostrar un cartel avisando que no se puede borrar. Si es exitoso, que se borre de la tabla sin recargar la página usando Signals."

**2. Refinamiento visual y de UX:**
> "El cartel de error 409 me está ocultando la tabla de proyectos porque usa la misma señal de error crítico. Quiero separar esto. ¿Podemos crear una nueva señal `actionMessage` que sea solo para estas acciones (borrado exitoso o error 409) y que se muestre arriba de las pestañas sin ocultar la lista? Además, que el cartel de éxito desaparezca a los 3 segundos y el de error a los 5 segundos."