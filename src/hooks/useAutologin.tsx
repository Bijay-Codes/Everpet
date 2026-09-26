import { useContext, useEffect, useState } from "react";
import { END_POINTS } from "../API/api-endpoints";
import { getFromLocalStorage } from "../util/util";
import { AuthContext } from "../context/auth-context";


export type Status = 'success' | 'pending' | 'rejected';

export default function useAutoLogin() {
    const [status, setStatus] = useState<Status>('pending');
    const authContext = useContext(AuthContext)
    if (!authContext) throw new Error('Auth context isnt mounted properly');
    const { setUser } = authContext;
    if (!setUser) throw new Error('Auth context not set up or values not provided');

    useEffect(() => {
        if (status === 'success') return;
        const fetchResponse = fetch(END_POINTS.refresh, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${getFromLocalStorage('x-csrf-token') ?? ''}`,
                'Content-Type': 'application/json'
            }
        });
        fetchResponse.then(async res => {
            if (res.ok) {
                const parsed = await res.json();
                if (parsed.res.isSuccess) {
                    setStatus('success');
                    setUser(parsed.res.data);
                } else {
                    setStatus('rejected');
                };
            } else {
                setStatus('rejected');
            };
        }
        )
    }, [status, setUser]);
    return {
        status: status
    };
};