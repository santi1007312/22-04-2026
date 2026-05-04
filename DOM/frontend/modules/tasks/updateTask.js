export async function updateTask (id, title, description, userId) {
    try {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'PUT', // o 'PATCH'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                descripcion: description,
                userId: userId,
                userID: userId
            })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la tarea');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}