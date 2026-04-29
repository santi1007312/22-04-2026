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

import { getUsers } from "../modules/users/index.js";
import {get  } from "../modules/helpers/index.js";
import { createTask, getTasks } from "../modules/tasks/index.js";

// ============================================
// 2. FUNCIONES AUXILIARES
// ============================================

function renderTasks(tasks) {
    // Limpiamos el contenedor
    tasksContainer.innerHTML = '';
    
    contadorTareas = tasks.length;
    taskCount.textContent = contadorTareas;

    if (tasks.length === 0) {
        // Si no hay tareas, mostramos el mensaje de "vacío"
        emptyState.style.display = 'block';
        tasksContainer.appendChild(emptyState);
        return;
    }

    // Si hay tareas, ocultamos el estado vacío
    emptyState.style.display = 'none';

    // Iteramos y creamos los elementos
    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');

        taskCard.innerHTML = `
            <div class="task-info">
                <h4>${task.title}</h4>
                <p>${task.descripcion || task.description}</p>
            </div>
        `;
        tasksContainer.appendChild(taskCard);
    });
}

/**
 * Función para cargar y actualizar la lista de tareas
 */
async function loadAndRefreshTasks(userId) {
    try {
        // Traemos todas las tareas para filtrar manualmente por ambos campos
        const allTasks = await get(`tasks`);
        
        // Filtramos las que tengan userId (minúscula) O userID (mayúscula) igual al del usuario
        const userTasks = allTasks.filter(t => t.userId == userId || t.userID == userId);
        
        renderTasks(userTasks);
    } catch (error) {
        console.error("Error al cargar tareas:", error);
    }
}

function showError(errorElement, message) {
    errorElement.textContent = message;
}

function clearError(errorElement, inputElement) {
    errorElement.textContent = '';
    inputElement.classList.remove('error');
}

function isValidInput(input, message, errorElement){
    if (!input.value.trim()) {
        showError(errorElement, message);
        input.classList.add('error');
        return false;
    }else{
        clearError(errorElement, input);
        return true;
    }
}
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
userDocInput.addEventListener('input', () => {
    if (userDocInput.value.trim().length > 0) {
        clearError(userDocError, userDocInput);
    }
});

// ============================================
// 3. Manipulacion del DOM
// ============================================


    

// ============================================
// 4. MANEJO DE EVENTOS (Lógica de las funciones)
// ============================================

/**
 * Lógica para limpiar el error mientras se escribe
 */
function handleInputChange() {
    if (userDocInput.value.trim().length > 0) {
        clearError(userDocError, userDocInput);
    }
}

/**
 * Función principal para el envío del formulario
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const isFieldValid = isValidInput(
        userDocInput, 
        'El documento del usuario es obligatorio', 
        userDocError
    );

    if (!isFieldValid) return;

    try {
        const value = userDocInput.value.trim();
        const users = await getUsers();
        const user = users.find(u => u.document === value);

        if (!user) {
            const msgNoExiste = 'Usuario no encontrado';
            showError(userDocError, msgNoExiste);
            alert(msgNoExiste); 
            return;
        }

        if (!user.active) {
            const msgInactivo = 'El usuario existe pero está inactivo';
            showError(userDocError, msgInactivo);
            alert(msgInactivo); 
            return;
        }

        clearError(userDocError, userDocInput);
        alert(`¡Usuario encontrado con éxito!\nBienvenido/a: ${user.name}`);
        console.log('Usuario validado:', user);

        // gualdar en el local storage el id del user
        const currentUserId=localStorage.setItem('idUsuarioActual', user.id);

        // Activar Formulario echo por Juan David Ramirez Saavedra
        const taskFormContainer = document.getElementById("taskFormContainer");
        taskFormContainer.classList.remove("formulario-oculto")

        taskForm.addEventListener("submit", (e)=>{
            e.preventDefault();

            const valueTaskTitle = taskInputTitle.value.trim();
            const valueTaskDescription = taskInputDescription.value.trim();

            if (valueTaskTitle === "" & valueTaskDescription === ""){
                
                const formError = document.querySelectorAll(".inputTask")
                formError.forEach((error)=>{
                    error.classList.add("formularioError")
                })

                alert("¡Error! La descripción de la tarea es obligatoria.");
                return;
            }
            
            alert("Tarea válida, procediendo al envío");
            createTask(taskInputTitle.value,taskInputDescription.value, currentUserId);

            alert("Tarea enviada correctamente");
            taskInputDescription.value = "";
            taskInputTitle.value = "";
        });


        loadAndRefreshTasks(user.id);

        
        
        
    } catch (error) {
        console.error('Error:', error);
        showError(userDocError, 'Error al conectar con el servidor');
    }
}
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
