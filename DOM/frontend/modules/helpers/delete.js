export const remove = async (endpoint, id) => {
    const response = await fetch(`http://localhost:3000/${endpoint}/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) throw new Error("no se pudo borrar la tarea");
    return await response.json()
};