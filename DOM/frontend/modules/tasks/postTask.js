import {post} from "../helpers/post.js"

export const createTask = (title,description) => {
    const idUsuario = localStorage.getItem("idUsuarioActual");
    const newTask = {
        title: title,
        description:description,
        userID: parseInt(idUsuario)
    }
    post("tasks", newTask);

    alert("¡Tarea creada y asociada con éxito!")
}