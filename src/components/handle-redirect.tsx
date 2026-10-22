import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { Navigate, Outlet } from "react-router-dom";
import PetsProvider from "../context/pets-provider";

export default function HandleRedirect() {
    const { isLoggedIn } = useContext(AuthContext)!;
    return isLoggedIn ? <PetsProvider> <Outlet /></PetsProvider> : <Navigate to="/" replace />;
};