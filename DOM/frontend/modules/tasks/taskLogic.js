import { get} from "../helpers/index.js";
import { deleteData } from "../tasks/index.js";
import { updateTask } from "./updateTask.js";
import { notify } from "../helpers/notifications.js";


export function renderTasks(tasks, tasksContainer, taskCount, emptyState) {
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

        h4Title.textContent = task.title;
        pContent.textContent = task.descripcion || task.description;
        buttonDelete.textContent = 'Eliminar';
        buttonEdit.textContent = 'Editar';

        divTask.appendChild(h4Title);
        divTask.appendChild(pContent);
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

        buttonEdit.addEventListener('click', async () => {
            const nuevoTitulo = prompt("Editar título de la tarea:", task.title);
            const nuevoDescripcion = prompt("Editar descripción de la tarea:", task.descripcion || task.description);

            if (nuevoTitulo === null || nuevoDescripcion === null) return; 

            if (nuevoTitulo.trim() === "" || nuevoDescripcion.trim() === "") {
                notify.show("El título y la descripción no pueden estar vacíos.", "error");
                return;
            }

            try {
                const currentUserId = localStorage.getItem('idUsuarioActual') || task.userId || task.userID;
                await updateTask(task.id, nuevoTitulo.trim(), nuevoDescripcion.trim(), currentUserId);

                h4Title.textContent = nuevoTitulo.trim();
                pContent.textContent = nuevoDescripcion.trim();
                task.title = nuevoTitulo.trim();
                task.descripcion = nuevoDescripcion.trim();
                
                notify.show("¡Tarea actualizada correctamente!", "success");
            } catch (error) {
                notify.show("Hubo un error al actualizar la tarea.", "error");
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