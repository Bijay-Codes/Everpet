import { END_POINTS } from "./api-endpoints";
type PetData = {
    name: string;
    species:string;
    
}
export default async function postNewPet(accessToken: string, petData: PetData) {
    const response = await fetch(END_POINTS.createPet, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(petData)
    });
    try {
        const parsed = await response.json();
        if (response.ok) {
            return parsed.res;
        } else {
            return { isSuccess: false, err: parsed.err };
        }
    } catch {
        return { isSuccess: false, message: 'Something went wrong' };
    }
};