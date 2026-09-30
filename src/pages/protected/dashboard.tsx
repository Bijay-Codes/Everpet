import { useContext } from "react"
import { AuthContext, type AuthContextType } from "../../context/auth-context"


export default function Dashboard() {
    const user: AuthContextType | null = useContext(AuthContext);

    if (!user || !user.isLoggedIn) {
        throw new Error('Auth context data could not be accessed');
    };
    return (
        <section className="px-6 py-4">
            <div className="text-white text-center text-3xl">
                <div >Welcome back : {user.userInfo?.username}</div>
                <span className="text-xl">Lets go on a ride</span>
            </div>
        </section >
    );
};