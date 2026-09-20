const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error('VITE_API_URL is not set');


export const END_POINTS = {
    login: `${import.meta.env.VITE_API_URL}/auth/login`,
    register: `${import.meta.env.VITE_API_URL}/auth/register`,
    refresh: `${import.meta.env.VITE_API_URL}/auth/refresh`
} as const;