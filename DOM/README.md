Antes de iniciar el desarrollo, analiza cuidadosamente el enunciado e identifica: 
• ¿Qué información debe ingresar el usuario? 
rta: El usuario ingresara dos tipos de informacion: 
-El documento del usuario
-El nombre de la tarea, la descripcion y el estado

• ¿Qué acciones debe realizar el sistema? 
rta: -Va a capturar el formulario al escuchar el evento submit y evitara la recarga con preventDefault()

-Validara los datos a traves de la verificacion de que el campo no este vacio y no tenga solo espacios

-Consultar al usuario en la api

-Mostrara el resultado de la busqueda en el caso de que el usuario exista o no

-Permitira agregar las tareas habilitando el formulario de las tareas y capturar la nueva tarea

-Creara tareas dinamicas(DOM) sin recargar la pagina e insertando en tasksContainer

-Actualizara la interfaz con el contador de tareas, ocultar el estado vacio y mostrar la lista de tareas

• ¿Qué resultados debe mostrar la interfaz?
rta: -Mostrara mensajes de validación como que el campo es obligatorio junto con el campo en rojo

-Mostrara el resultado de búsqueda, si el usuario fue encontrado o no

-Mostrara la lista de tareas

-Mostrara el estado vacío de las tareas

-Mostrar el contador dinámico de tareas

// ============================================
// 6. REFLEXIÓN Y DOCUMENTACIÓN
// ============================================
/**
 * PREGUNTAS DE REFLEXIÓN:
 * 
 * 1. ¿Qué elemento del DOM estás seleccionando?
 *    R: Hemos seleccionado los elementos esenciales para el flujo de la aplicación: el formulario de búsqueda (userForm), el campo de entrada para el documento (userDocInput) y el contenedor de errores (userDocError). Además, para la segunda fase, integré los selectores del formulario de tareas (taskForm), sus inputs de título y descripción, y el contenedor principal (taskFormContainer) para controlar su visibilidad.
 * 
 * 2. ¿Qué evento provoca el cambio en la página?
 *    R: La interacción se basa principalmente en el evento submit, que activa tanto la validación y búsqueda del usuario como el posterior envío de la tarea. También implementé el evento input en el campo de texto para que la interfaz reaccione en tiempo real, limpiando los mensajes de error apenas el usuario comienza a corregir su entrada.

 * 3. ¿Qué nuevo elemento se crea?
 *    R: En lugar de crear etiquetas desde cero, el trabajo se centró en la manipulación de estados. Se crea una persistencia de datos en el localStorage al guardar el ID del usuario validado. Visualmente, el cambio más importante es la "aparición" del formulario de tareas, la cual se logra manipulando la lista de clases de CSS para remover la restricción de visibilidad.
 * 
 * 4. ¿Dónde se inserta ese elemento dentro del DOM?
 *    R: Las modificaciones ocurren en nodos ya existentes dentro del archivo index.html. El mensaje de error se inserta dinámicamente como texto dentro del span userDocError, y el formulario de tareas se hace presente en su ubicación original dentro del flujo del documento una vez que el usuario es autenticado.
 * 
 * 5. ¿Qué ocurre en la página cada vez que repites la acción?
 *    R: Cada vez que se realiza una nueva búsqueda, el sistema reinicia el ciclo: limpia los errores previos, valida el nuevo input y consulta la API. Si el usuario es válido, se actualiza el localStorage con el nuevo ID y se mantiene habilitado el formulario de tareas, permitiendo registrar múltiples pendientes de forma consecutiva y limpiando los campos tras cada envío exitoso.
 */