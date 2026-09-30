import { useContext } from "react"
import { AuthContext } from "../context/auth-context"

export default function ShowOffline() {
    const networkStatus = useContext(AuthContext)?.networkStatus;
    return (
        <>{
            networkStatus === 'offline'
            &&
            <span
                className="bg-status-danger text-sm rounded-bl-lg px-6 py-4 inline-flex justify-center items-center absolute right-0">
                You're offline. Check your internet connection.
            </span>
        }
        </>
    )
}