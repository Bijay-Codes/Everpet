import { useContext } from "react"
import { AuthContext } from "../context/auth-context"
import { useNavigate } from "react-router-dom";

function CTAButtons() {
    const navTo = useNavigate();
    return (
        <section className="flex flex-col gap-4">
            <span>Our Auto login attempt failed please login or register to continue</span>
            <div className="flex gap-4 m-auto">
                <button className="bg-fuchsia-400 text-fuchsia-900 py-2 px-6 rounded" onClick={() => navTo('/login')}>Login</button>
                <button className="bg-violet-400 text-violet-950 px-6 py-2 rounded" onClick={() => navTo('/register')}>
                    Register
                </button>
            </div>
        </section>
    );
};
export function WelcomeScreen() {
    const userInfo = useContext(AuthContext);
    const status = userInfo?.status ?? 'pending';
    const showCTA = status === 'server-issue' || status === 'pending' || status === 'rejected';
    return (
        <section className="flex flex-col gap-6 justify-center items-center max-w-200 m-auto text-white h-full mt-auto">
            <h1 className="text-2xl font-extrabold">Welcome to Everpet</h1>
            <h2 className="text-center">The backend is starting up please wait (You can expect this to take approx 20-50 seconds depending on your network connection)</h2>
            <h3>Status : {userInfo?.status} </h3>
            {showCTA ? (
                <CTAButtons />
            ) : (
                <button
                    className="bg-cyan-400 text-cyan-950 px-6 py-2 rounded"
                    disabled={!showCTA}>
                    Start now
                </button>
            )
            }
        </section >
    );
};