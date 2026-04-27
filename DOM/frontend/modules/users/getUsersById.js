import { get } from "../helpers/index.js";
export const getUserById = async (id) => {
    try {
        const user = await get(`users/${id}`);
        return user;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return null;
    }
}