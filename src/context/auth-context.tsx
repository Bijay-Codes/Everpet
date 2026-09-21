import { createContext } from "react";

export const AuthContext = createContext<AuthContextType | null>(null);
export type AuthContextType = {
    status: 'pending' | 'success' | 'rejected' | 'server-issue' | null
    isLoggedIn: boolean;
    userInfo: UserData;
    setUser: React.Dispatch<React.SetStateAction<UserData>>,
    setStatus: React.Dispatch<React.SetStateAction<"pending" | "success" | "rejected" | "server-issue" | null>>
}
export type UserData = {
    userId: string | null,
    username: string | null,
    email: string | null,
    accessToken: string | null
    csrfToken: string | null
} | null
