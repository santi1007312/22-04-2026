import {post} from "../helpers/post.js"

export const createTask = async (title,description) => {
    const idUsuario = localStorage.getItem("idUsuarioActual");

    const newTask = {
        title: title,
        description:description,
        userId: parseInt(idUsuario)
    }
    await post("tasks", newTask);

    alert("¡Tarea creada y asociada con éxito!")
}