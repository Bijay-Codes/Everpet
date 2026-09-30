import { Outlet } from "react-router-dom";
import Navbar from "./navbar";

export default function ProtectedNav() {
    return (
        <main className="flex">
            <Navbar />
            <Outlet />
        </main>
    )
}