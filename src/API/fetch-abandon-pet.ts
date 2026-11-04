import { END_POINTS } from "./api-endpoints";

export default async function fetchAbandonPet(petId: string, accessToken: string) {
    console.log(petId)
    const res = await fetch(END_POINTS.abandonPet, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            petId
        })
    });
    return res;
}