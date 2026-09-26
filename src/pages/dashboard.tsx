import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { AuthContext, type AuthContextType } from "../context/auth-context"


export default function Dashboard() {
    const user: AuthContextType | null = useContext(AuthContext);

    if (!user || !user.isLoggedIn) {
        return <Navigate to='/' replace />;
    };
    return (
        <section className="text-white">
            <div className="text-white text-center text-3xl">
                <div >Welcome back : {user.userInfo?.username}</div>
                <span className="text-xl">Lets go on a ride</span>
            </div>
        </section >
    );
}