import { useContext } from "react"
import { AuthContext } from "../context/auth-context"

export function WelcomeScreen() {
    const authContext = useContext(AuthContext);
    return (
        <section>
            <h1>Welcome to Everpet</h1>
            <h2>The backend is starting up please wait</h2>
            <h3>Status : {authContext?.isLoggedIn ?? 'Loading'} </h3>
            <button disabled={authContext?.isLoggedIn}>Start now</button>
        </section>
    )
}