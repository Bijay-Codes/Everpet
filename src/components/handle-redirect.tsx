import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { Navigate, Outlet } from "react-router-dom";

export default function HandleRedirect() {
    const { isLoggedIn } = useContext(AuthContext)!;
    return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
}