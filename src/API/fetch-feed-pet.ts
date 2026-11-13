import { END_POINTS } from "./api-endpoints";

export async function fetchFeedPet(petId: string, accessToken: string) {
    const res = await fetch(END_POINTS.feedPet, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            petId: petId
        })
    })
    return res;
}