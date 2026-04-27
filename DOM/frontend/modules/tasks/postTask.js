import {post} from "../helpers/post.js"

export const createTask = (title,descripcion) => {
    const idUsuario = localStorage.getItem("idUsuarioActual");
    const newTask = {
        title: title,
        descripcion:descripcion,
        userID: parseInt(idUsuario)
    }
    post("tasks", newTask);

    alert("¡Tarea creada y asociada con éxito!")
}