/**
 * ============================================
 * EJERCICIO DE MANIPULACIÓN DEL DOM
 * ============================================
 * 
 * Autor: [Eileen Mendoza]
 * Fecha: [26-04-2026]
 * ============================================
 */

// ============================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ============================================

import { getUsers } from "../modules/users/index.js";
import { createTask } from "../modules/tasks/index.js";
import { showError, clearError, isValidInput } from "../modules/helpers/index.js";
import { notify } from "../modules/helpers/index.js";
import { loadAndRefreshTasks } from "../modules/tasks/index.js";
import { cargarDatosFiltrados,renderTasks} from "../modules/tasks/index.js";
import { exportToJSON } from "../modules/helpers/exportHelpers.js";
import { getCurrentTasks } from "../modules/tasks/taskLogic.js";

/**
 * Seleccionamos los elementos del DOM que necesitamos manipular.
 * Usamos getElementById para obtener referencias a los elementos únicos.
 */

const userForm = document.getElementById('userForm');
const userDocInput = document.getElementById('userDoc');
const userDocError = document.getElementById('userDocError');

const totalUsers = document.getElementById('usersBtn');
const divUsers = document.getElementById('card_totalUsers');

const taskForm = document.getElementById('taskForm');
const taskInputTitle = document.getElementById('taskInputTitle');
const taskInputDescription = document.getElementById('taskInputDescription');

// SELECCIÓN DEL DOM ()
const tasksContainer = document.getElementById('tasksContainer');
const taskCount = document.getElementById('taskCount');
const emptyState = document.getElementById('emptyState');
let contadorTareas = 0; // Para actualizar el número de tareas arriba

const inputFecha = document.getElementById('filtroFecha');
const inputNombre = document.getElementById('filtroNombre');
const inputEstado = document.getElementById('filtroEstado')

const exportTasksBtn = document.getElementById()
// ============================================
// 2. FUNCIONES AUXILIARES
// ============================================

async function realizarBusqueda() {
    const fecha = inputFecha.value;
    const nombreBusqueda = inputNombre.value.toLowerCase().trim();
    const estadoBusqueda = inputEstado.value;

    const datos = await cargarDatosFiltrados(fecha);
    
    
    const userId = localStorage.getItem('idUsuarioActual');
    const tareasFinales = datos.filter(t => {
        
        const esMismoUsuario = (t.userId == userId || t.userID == userId);


        const coincideNombre = t.title.toLowerCase().includes(nombreBusqueda);

        const coincideEstado = estadoBusqueda === "" || t.estado === estadoBusqueda;

        return esMismoUsuario && coincideNombre && coincideEstado;
    });
    renderTasks(tareasFinales, tasksContainer, taskCount, emptyState);
}
inputFecha.addEventListener("change", realizarBusqueda);
inputNombre.addEventListener("input", realizarBusqueda);
inputEstado.addEventListener("change", realizarBusqueda);

// document.addEventListener("DOMContentLoaded", () => {

//     const hoy = new Date("2026-01-01");
    

//     const fechaISO = hoy.toISOString().split('T')[0];

//     const inputFecha = document.getElementById('filtroFecha');
//     inputFecha.value = fechaISO;

//     // realizarBusqueda(); 
// });

let isVisible = false;
totalUsers.addEventListener('click', async ()=>{
    if (isVisible) {
        divUsers.innerHTML = ""; // Limpia el contenedor
        totalUsers.textContent = "Mostrar usuarios"; // Cambia el texto
        isVisible = false;
        divUsers.classList.remove('card_totalUsers')
        return; // Salimos de la función
    }
    
    const users = await getUsers();
    divUsers.innerHTML = "";
    divUsers.classList.add('card_totalUsers')
    users.forEach((e)=>{
        const card_Users = document.createElement("div");
        const pNombreUsers = document.createElement("p");
        pNombreUsers.classList.add('pcolor')
        const pDoc = document.createElement("p");
        pNombreUsers.textContent= `Nombre: ${e.name}`
        pDoc.textContent= `Documento: ${e.document}`

        card_Users.appendChild(pNombreUsers)
        card_Users.appendChild(pDoc)
        divUsers.appendChild(card_Users)
        
    })
    // 3. Actualizamos el estado y el botón
    totalUsers.textContent = "Esconder usuarios";
    isVisible = true;
    
})

function handleInputChange() {
    if (userDocInput.value.trim().length > 0) clearError(userDocError, userDocInput);
}


// ============================================
// 3. MANEJO DE EVENTOS (Lógica de las funciones)
// ============================================


/**
 * Función principal para el envío del formulario
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!isValidInput(userDocInput, 'El documento es obligatorio', userDocError)) return;

    try {
        const users = await getUsers();
        const user = users.find(u => u.document === userDocInput.value.trim());

        if (!user || !user.active) {
            const msg = !user ? 'Usuario no encontrado' : 'Usuario inactivo';
            showError(userDocError, msg);
            notify.show(msg, "error");
            return;
        }

        notify.show(`¡Usuario encontrado con éxito!\nBienvenido/a: ${user.name}`, "success");

        // gualdar en el local storage el id del user
        localStorage.setItem('idUsuarioActual', user.id);
        
        // Activar Formulario echo por Juan David Ramirez Saavedra
        document.getElementById("taskFormContainer").classList.remove("formulario-oculto");
        loadAndRefreshTasks(user.id, tasksContainer, taskCount, emptyState);
    } catch (error) {
        console.error('Error:', error);
        notify.show("Error al conectar con el servidor", "error");
    }
}
taskForm.addEventListener("submit",async (ev)=>{
    ev.preventDefault();

    // 1. Obtenemos el ID que guardamos en handleFormSubmit
    const currentUserId = localStorage.getItem('idUsuarioActual');            
    const validT = isValidInput(taskInputTitle, 'Título obligatorio', document.getElementById('tituloError'));
    const validD = isValidInput(taskInputDescription, 'Descripción obligatoria', document.getElementById('tareaError'));
    const fechaActual = new Date();

    const año = fechaActual.getFullYear();
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const dia = fechaActual.getDate().toString().padStart(2, '0'); 

    const date = `${año}-${mes}-${dia}`;
    if (validT && validD && currentUserId) {
        try {
            // Usamos currentUserId en lugar de user.id
            await createTask(taskInputTitle.value, taskInputDescription.value, date, currentUserId);
            
            notify.show("Tarea enviada correctamente", "success");
            
            // Refrescamos la lista usando el ID recuperado
            loadAndRefreshTasks(currentUserId, tasksContainer, taskCount, emptyState);
            
            // Limpiamos los campos
            taskInputDescription.value = "";
            taskInputTitle.value = "";
        } catch (error) {
            console.error("Error al crear tarea:", error);
            notify.show("No se pudo crear la tarea", "error");
        }
    } else if (!currentUserId) {
        notify.show("Error: No se detectó un usuario activo", "error");
    }
});
// ============================================
// 5. REGISTRO DE EVENTOS
// ============================================

userForm.addEventListener('submit', handleFormSubmit);
userDocInput.addEventListener('input', handleInputChange);

// ============================================
// 6. REFLEXIÓN Y DOCUMENTACIÓN
// ============================================
/**
 * PREGUNTAS DE REFLEXIÓN:
 * 
 * 1. ¿Qué elemento del DOM estás seleccionando?
 *    R: 
 * 
 * 2. ¿Qué evento provoca el cambio en la página?
 *    R: 
 * 
 * 3. ¿Qué nuevo elemento se crea?
 *    R: 
 * 
 * 4. ¿Dónde se inserta ese elemento dentro del DOM?
 *    R: 
 * 
 * 5. ¿Qué ocurre en la página cada vez que repites la acción?
 *    R: 
 */


// ============================================
// 7. INICIALIZACIÓN (OPCIONAL)
// ============================================

/**
 * Esta función se ejecuta cuando el DOM está completamente cargado
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM completamente cargado');
    console.log('📝 Aplicación de registro de mensajes iniciada');
    
    // Aquí puedes agregar cualquier inicialización adicional
    // Por ejemplo, cargar mensajes guardados del localStorage
});


// ============================================
// 8. FUNCIONALIDADES ADICIONALES (BONUS)
// ============================================

/**
 * RETOS ADICIONALES OPCIONALES:
 * 
 * 1. Agregar un botón para eliminar mensajes individuales
 * 2. Implementar localStorage para persistir los mensajes
 * 3. Agregar un contador de caracteres en el textarea
 * 4. Implementar un botón para limpiar todos los mensajes
 * 5. Agregar diferentes colores de avatar según el nombre del usuario
 * 6. Permitir editar mensajes existentes
 * 7. Agregar emojis o reacciones a los mensajes
 * 8. Implementar búsqueda/filtrado de mensajes
 */
