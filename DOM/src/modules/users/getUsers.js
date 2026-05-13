import { get } from "../helpers/index.js";

export const getUsers = async () => {
    const data = await get('users');
    return data;
}