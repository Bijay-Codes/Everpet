import { useContext } from "react"
import { AuthContext, type AuthContextType } from "../context/auth-context"
import { useNavigate } from "react-router-dom";
function isRequestSuccess(status: AuthContextType['status'] | undefined) {
    if (status === null || status === 'pending' || status === undefined) {
        return false;
    } else {
        return true;
    }
}
function CTAButtons() {
    const navTo = useNavigate();
    return (
        <section className="flex flex-col gap-4">
            <span>Our Auto login attempt failed please login or register to continue</span>
            <div className="flex gap-4 m-auto">
                <button className="bg-fuchsia-400 text-fuchsia-900 py-2 px-6 rounded">Login</button>
                <button className="bg-violet-400 text-violet-950 px-6 py-2 rounded" onClick={() => navTo('/register')}>
                    Register
                </button>
            </div>
        </section>
    )
}
export function WelcomeScreen() {
    const userInfo = useContext(AuthContext);
    return (
        <section className="flex flex-col gap-6 justify-center items-center max-w-200 m-auto text-white h-full mt-auto">
            <h1 className="text-2xl font-extrabold">Welcome to Everpet</h1>
            <h2 className="text-center">The backend is starting up please wait (You can expect this to take approx 20-50 seconds depending on your network connection)</h2>
            <h3>Status : {userInfo?.status} </h3>
            {isRequestSuccess(userInfo?.status) ? (
                <button
                    className="bg-cyan-400 text-cyan-950 px-6 py-2 rounded"
                    disabled={isRequestSuccess(userInfo?.status)}>
                    Start now
                </button>
            ) : (
                <CTAButtons />
            )}
        </section>
    )
}