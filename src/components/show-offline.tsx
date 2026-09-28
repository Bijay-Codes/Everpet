import { useContext } from "react"
import { AuthContext } from "../context/auth-context"

export default function ShowOffline() {
    const networkStatus = useContext(AuthContext)?.networkStatus;
    return (
        <>{
            networkStatus === 'offline'
            &&
            <span className="bg-status-danger px-6 py-4 inline-flex justify-center items-center rounded absolute right-0">Please check your internet connection</span>
        }
        </>
    )
}