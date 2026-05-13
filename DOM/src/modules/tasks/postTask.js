import {post} from "../helpers/post.js"

export const createTask = async (title,description,date) => {
    const idUsuario = localStorage.getItem("idUsuarioActual");

    const newTask = {
        title: title,
        description:description,
        date:date,
        estado:"en progreso",
        userId: parseInt(idUsuario)
    }
    await post("tasks", newTask);

}