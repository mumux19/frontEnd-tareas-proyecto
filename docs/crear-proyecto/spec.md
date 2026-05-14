# Feature: Crear un Nuevo Proyecto

## Descripción general
El usuario puede dar de alta un nuevo proyecto en el sistema. Debe completar un formulario con los datos básicos requeridos y los plazos de ejecución. Esta funcionalidad interactúa directamente con las validaciones de negocio del backend.

## Endpoints involucrados
* **POST** `/projects`
* **Request Body:** ```json
  {
    "id": null,
    "name": "Website Redesign",
    "startDate": "2025-10-01",
    "endDate": "2025-12-01",
    "status": "ACTIVE",
    "description": "Migrate and redesign website"
  }
 Response:

201 Created → proyecto creado correctamente
400 Bad Request → datos inválidos
409 Conflict → nombre de proyecto duplicado

##Restricciones de negocio
El nombre del proyecto debe ser único y obligatorio.
La fecha de fin (endDate)debe ser mayor o igual a la fecha de inicio.
La fecha de fin no puede ser anterior a la fecha actual al momento de creación.
Todos los campos obligatorios deben estar completos.
El estado del proyecto solo puede ser: PLANNED, ACTIVE o CLOSED.


Lineamientos técnicos
Componente: Angular Standalone Component.

Estilos: Bootstrap 5 (Formularios, validaciones visuales, botones).

Formularios: Reactive Forms. Es indispensable para validar en tiempo real que el endDate sea mayor al startDate antes de enviar la petición.

Comunicación: HttpClient para consumir el endpoint y crear en un ProyectoService.

Estado: Signals para manejar el estado de guardado (isSaving, successMessage, errorMessage).

Validaciones en frontend:
-name requerido
-startDate requerido
-endDate requerido
-status requerido
Manejo de estados:
-loading
-error
-éxito (feedback visual)
Redirección al listado de proyectos luego de creación exitosa (si aplica).
Manejo de errores HTTP (400, 409).


Criterios de aceptación
Dado que el usuario está en el formulario, cuando ingresa todos los datos válidos y hace clic en crear, entonces el sistema hace la petición POST, recibe un código 201 y muestra un mensaje de éxito.

Dado que el usuario ingresa una fecha de fin (endDate) anterior a la fecha de inicio, cuando intenta enviar el formulario, entonces el botón de submit se deshabilita o el formulario muestra un error de validación visual indicando la restricción.


Dado que el usuario ingresa un nombre de proyecto que ya existe, cuando envía el formulario, entonces el backend devuelve un 409 Conflict y la pantalla muestra un cartel de error indicando que el nombre ya está en uso.

Dado que faltan campos obligatorios,cuando intenta enviar el formulario,entonces se muestran errores de validación en el frontend.


PROMT UTILIZADOS 