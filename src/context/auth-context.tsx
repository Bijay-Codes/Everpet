import { createContext } from "react";

export const AuthContext = createContext<AuthContextType | null>(null);

export type AuthContextType = {
    isLoggedIn: boolean;
    userInfo: UserData;
    setUser: React.Dispatch<React.SetStateAction<UserData>>,
}
export type UserData = {
    userId: string | null,
    username: string | null,
    email: string | null,
    accessToken: string | null
    csrfToken: string | null
} | null
