import { useMemo, useState, type ReactNode } from "react";
import type { UserData } from "./auth-context";
import { AuthContext } from "./auth-context";

export default function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const values =
        useMemo(() =>
            ({ isLoggedIn: !!user, userInfo: user, setUser: setUser }),
            [user, setUser]);
    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};