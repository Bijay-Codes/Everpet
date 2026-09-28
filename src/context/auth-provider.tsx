import { useMemo, useState, type ReactNode } from "react";
import type { UserData } from "./auth-context";
import { AuthContext } from "./auth-context";
import useOnline from "../hooks/useOnline";

export default function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const networkStatus = useOnline() ?? null;
    const values =
        useMemo(() =>
            ({ isLoggedIn: !!user, userInfo: user, setUser: setUser, networkStatus: networkStatus }),
            [user, setUser, networkStatus]);
    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};