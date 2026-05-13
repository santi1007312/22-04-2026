import { get} from "../helpers/index.js";
import { deleteData } from "../tasks/index.js";
import { updateTask } from "./updateTask.js";
import { notify } from "../helpers/notifications.js";
let currentTasks = [];
export function getCurrentTasks(){
    return currentTasks;
}

export function renderTasks(tasks, tasksContainer, taskCount, emptyState) {
    currentTasks = tasks;
    tasksContainer.innerHTML = '';
    let contadorTareas = tasks.length; 
    taskCount.textContent = contadorTareas;

    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        tasksContainer.appendChild(emptyState);
        return;
    }

    emptyState.style.display = 'none';

    tasks.forEach(task => {
        const divTask = document.createElement('div');
        divTask.classList.add('task-card'); // Tu clase original

        const h4Title = document.createElement('h4');
        const pContent = document.createElement('p');
        const buttonDelete = document.createElement('button');
        buttonDelete.classList.add('btn-delete'); // Tu clase original
        const buttonEdit = document.createElement('button');
        buttonEdit.classList.add('btn-edit'); // Tu clase original
        const fecha = document.createElement("p")
        const estado = document.createElement("p")
        const containerInformation = document.createElement("div");
        containerInformation.classList.add("containerInformation")

        h4Title.textContent = task.title;
        pContent.textContent = task.descripcion || task.description;
        fecha.textContent = task.date;
        estado.textContent = task.estado
        buttonDelete.textContent = 'Eliminar';
        buttonEdit.textContent = 'Editar';

        containerInformation.appendChild(h4Title);
        containerInformation.appendChild(pContent);
        containerInformation.appendChild(fecha);
        containerInformation.appendChild(estado)
        divTask.appendChild(containerInformation);
        divTask.appendChild(buttonDelete);
        divTask.appendChild(buttonEdit);

        tasksContainer.appendChild(divTask);

        buttonDelete.addEventListener('click', async () => {
            const confirmar = confirm(`¿Desea eliminar la tarea ${task.title}?`);
            if (confirmar) {
                try {
                    await deleteData('tasks', task.id);
                    divTask.remove();
                    contadorTareas--;
                    taskCount.textContent = contadorTareas;
                    currentTasks = currentTasks.filter(t => t.id !== task.id);
                    if (contadorTareas === 0) {
                        emptyState.style.display = 'block';
                        tasksContainer.appendChild(emptyState);
                    }
                    notify.show("Tarea eliminada", "success");
                } catch (error) {
                    notify.show("Error al eliminar la tarea", "error");
                }
            }
        });

        buttonEdit.addEventListener('click', () => {
            const editModal = document.getElementById('editModal');
            const editTitleInput = document.getElementById('editTaskTitle');
            const editDescInput = document.getElementById('editTaskDescription')

            if (editModal && editTitleInput && editDescInput) {

                editTitleInput.value = task.title;
                editDescInput.value = task.descripcion || task.description;

                window.activeEditing = {task, h4Title, pContent};

                editModal.classList.add('modal-activo');
            }
        });
    });
}

export async function loadAndRefreshTasks(userId, tasksContainer, taskCount, emptyState) {
    try {
        const allTasks = await get(`tasks`);
        const userTasks = allTasks.filter(t => t.userId == userId || t.userID == userId);
        renderTasks(userTasks, tasksContainer, taskCount, emptyState);
    } catch (error) {
        console.error("Error al cargar tareas:", error);
    }
}

export async function cargarDatosFiltrados(fecha, nombre) {
    try {
        // Usamos URLSearchParams para manejar los parámetros de forma limpia
        const params = new URLSearchParams();
        
        if (fecha) params.append('date', fecha);
        
        // Aquí está el truco: usamos 'title_like' para búsqueda flexible
        if (nombre) params.append('title_like', nombre);

        const response = await fetch(`http://10.5.225.161:3001/tasks?${params.toString()}`);
        return await response.json();
    } catch (error) {
        console.error("Error en el fetch:", error);
        return [];
    }
}

// ====================================================================
// Lógica de eventos para el Modal de Edición
// ====================================================================
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editTaskForm');
const closeModalBtn = document.getElementById('closeModalbtn');

if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Verificamos si hay una tarea en proceso de edición
        if (!window.activeEditing) return;

        const { task, h4Title, pContent } = window.activeEditing;
        const nuevoTitulo = document.getElementById('editTaskTitle').value.trim();
        const nuevoDescripcion = document.getElementById('editTaskDescription').value.trim();

        if (nuevoTitulo === "" || nuevoDescripcion === "") {
            notify.show("El título y la descripción no pueden estar vacíos.", "error");
            return;
        }

        try {
            const currentUserId = localStorage.getItem('idUsuarioActual') || task.userId || task.userID;
            
            // Consumimos el endpoint de actualizar que ya crearon
            await updateTask(task.id, nuevoTitulo, nuevoDescripcion, currentUserId);

            // Actualizamos la interfaz directamente
            h4Title.textContent = nuevoTitulo;
            pContent.textContent = nuevoDescripcion;
            
            // Actualizamos el objeto en memoria
            task.title = nuevoTitulo;
            if (task.hasOwnProperty('descripcion')) task.descripcion = nuevoDescripcion;
            if (task.hasOwnProperty('description')) task.description = nuevoDescripcion;

            // Cerramos el modal de forma limpia
            editModal.classList.remove('modal-activo');
            window.activeEditing = null;

            notify.show("¡Tarea actualizada correctamente!", "success");
        } catch (error) {
            notify.show("Hubo un error al actualizar la tarea.", "error");
        }
    });
}

// Evento para cerrar el modal desde la 'X'
if (closeModalBtn && editModal) {
    closeModalBtn.addEventListener('click', () => {
        editModal.classList.remove('modal-activo');
        window.activeEditing = null;
    });
}

// Cerrar el modal haciendo clic por fuera del recuadro
window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.classList.remove('modal-activo');
        window.activeEditing = null;
    }
});