export async function deleteData(endpoint, id) {
    const response = await fetch(`http://10.5.225.161:3001/${endpoint}/${id}`, {
        method: 'DELETE',
    });
    return await response.json();
}