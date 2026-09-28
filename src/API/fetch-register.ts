import { END_POINTS } from "./api-endpoints";
export default async function register(_prev: unknown, form: FormData) {
    try {
        const registerResponse = await fetch(END_POINTS.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: form.get('username-inp'),
                email: form.get('email-inp'),
                password: form.get('password-inp')
            })
        });

        if (registerResponse.ok) {
            const parsed = await registerResponse.json();
            if (parsed.res.isSuccess) {
                return parsed.res;
            } else {
                return parsed.res.err;
            };
        } else {
            try {
                const parsed = await registerResponse.json();
                return parsed.res.err;
            } catch {
                return { isSuccess: false, message: 'Something went wrong please try again later' };
            };
        };
    } catch {
        return { isSuccess: false, message: 'The server might be having issues try again after some time' };
    }
};
