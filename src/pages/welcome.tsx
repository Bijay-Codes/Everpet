import { useNavigate, type NavigateFunction } from "react-router-dom";
import useAutoLogin, { type Status } from "../hooks/useAutologin";


function CTAButtons({ navTo, status }: { navTo: NavigateFunction, status:Status }) {
    return (
        <section className="flex flex-col gap-4">
            <span className="text-center">Our Auto login attempt [ {status} ], please login or register to continue</span>
            <div className="flex gap-4 m-auto">
                <button className="bg-fuchsia-400 text-fuchsia-900 py-2 px-6 rounded" onClick={() => navTo('/login')}>Login</button>
                <button className="bg-violet-400 text-violet-950 px-6 py-2 rounded" onClick={() => navTo('/register')}>
                    Register
                </button>
            </div>
        </section>
    )
}
export function WelcomeScreen() {
    const { status } = useAutoLogin();
    const navTo = useNavigate();
    function isRequestSuccess() {
        return status === 'success';
    }

    return (
        <section className="flex flex-col gap-6 justify-center items-center max-w-300 m-auto text-white h-full mt-auto">
            <h1 className="text-2xl font-extrabold">Welcome to Everpet</h1>
            <h2 className="text-center">The backend is starting up please wait (You can expect this to take approx 20-50 seconds depending on your network connection)</h2>
            <h3>Status : {status} </h3>
            {isRequestSuccess() ? (
                <button
                    onClick={() => navTo('/dashboard')}
                    className="bg-cyan-400 text-cyan-950 px-6 py-2 rounded">
                    Start now
                </button>
            ) : (
                <CTAButtons navTo={navTo} status={status} />
            )}
        </section>
    )
}