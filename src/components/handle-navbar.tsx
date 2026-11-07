import { Outlet } from "react-router-dom";
import Navbar from "./navbar";

export default function ProtectedNav() {
    return (
        <main className="flex h-dvh">
            <Navbar />
            <div className="overflow-auto">
                <Outlet />
            </div>
        </main>
    )
}