import { END_POINTS } from "./api-endpoints";

export default async function fetchSpeciesCreatable(accessToken: string) {
    const response = await fetch(END_POINTS.getCreatableSpecies, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    return response;
};