import { useState, useEffect, type ReactNode } from "react";
import type { AuthContextType, UserData } from "./auth-context";
import { END_POINTS } from "../API/api-endpoints";
import { getFromLocalStorage } from "../util/util";
import { AuthContext } from "./auth-context";

export default function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [status, setStatus] = useState<AuthContextType['status']>(null);

    useEffect(() => {
        const authRequest = async () => {
            setStatus('pending');
            try {
                await fetch(END_POINTS.refresh, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${getFromLocalStorage('x-csrf-token') ?? ''}`,
                        'Content-Type': 'application/json'
                    }
                }).then(async res => {
                    if (res.ok) {
                        const parsed = await res.json();
                        const userData: UserData = parsed.res.data;
                        setUser(userData);
                        setStatus('success');
                        if (userData?.csrfToken) {
                            localStorage.setItem('x-csrf-token', userData.csrfToken);
                        }
                    } else if (res.status === 500) {
                        setStatus('server-issue');
                    } else {
                        setStatus('rejected');
                    }
                });
            } catch {
                setStatus('server-issue');
            }
        };

        authRequest();
    }, []);
    return (
        <AuthContext.Provider
            value={{ status: status, isLoggedIn: status === 'success', userInfo: user, setUser: setUser, setStatus: setStatus }}>
            {children}
        </AuthContext.Provider>
    )
};
