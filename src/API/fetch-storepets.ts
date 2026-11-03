import { END_POINTS } from "./api-endpoints";

export default async function fetchStorePets(accessToken: string, offset: number, limit: number = 20) {
    const url = END_POINTS.storePets + `${offset}` + `/${limit}`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    return response;
};