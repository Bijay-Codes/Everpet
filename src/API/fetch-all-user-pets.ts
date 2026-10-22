import { END_POINTS } from "./api-endpoints";
export default async function fetchAllPets(offset: number, limit: number = 20, accessToken: string) {
    const url = END_POINTS.allUserPets + `/${offset}/${limit}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken ?? null}`,
            'Content-Type': 'application/json'
        },
    });
    return response;
};