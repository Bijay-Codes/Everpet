import { END_POINTS } from "./api-endpoints";

export default async function fetchCreatePet(
    info: {
        accessToken: string,
        name: string,
        species: string
    }) {
    const response = await fetch(END_POINTS.createPet, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${info.accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            petData: {
                name: info.name,
                species: info.species
            }
        })
    });
    return response;
};