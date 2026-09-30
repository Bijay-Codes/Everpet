import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="h-dvh w-40 bg-card-bg text-white p-4">
            <ul className="flex flex-col gap-4 h-full">
                <li title="navigation">
                    <ul className="flex flex-col gap-2 text-xl">
                        <li><NavLink to='/dashboard'>DashBoard</NavLink></li>
                        <li><NavLink to='/pet-store'>PetStore</NavLink></li>
                        <li><NavLink to='/pets'>Pets</NavLink></li>
                    </ul>
                </li>
                <span className="flex-1" />
                <li title="user-settings">
                    <ul className="flex flex-col gap-2 text-sm">
                        <li>Profile</li>
                        <li>Settings</li>
                        <li>Log-out</li>
                    </ul>
                </li>
            </ul>
        </nav>
    )
}