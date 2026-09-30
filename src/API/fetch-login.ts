import { END_POINTS } from "./api-endpoints";
export default async function login(_prev: unknown, formInfo: FormData) {
    try {
        const loginResponse = await fetch(END_POINTS.login, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identifier: formInfo.get('identifier'),
                password: formInfo.get('password')
            })
        });
        if (loginResponse.ok) {
            const parsed = await loginResponse.json();
            return parsed.res;
        } else {
            try {
                const parsed = await loginResponse.json();
                return parsed.res.err;
            } catch {
                return { isSuccess: false, err: { message: 'Something went wrong. Try again.' } };
            }
        };
    } catch {
        return { isSuccess: false, err: { message: 'The server might be having some issues try again after some time' } };
    };
};