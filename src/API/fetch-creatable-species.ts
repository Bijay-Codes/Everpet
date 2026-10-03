import { END_POINTS } from "./api-endpoints";

export default async function fetchSpeciesCreatable(accessToken: string) {
    const response = await fetch(END_POINTS.getCreatableSpecies, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    try {
        if (!response.ok)
            return { isSuccess: false, err: 'Something went wrong' };
        const parsed = await response.json();

        if (parsed.isSuccess) {
            return parsed.res;
        } else {
            return { isSuccess: false, err: parsed.err };
        };
    } catch {
        return { isSuccess: false, err: 'Something went wrong' };
    };
};