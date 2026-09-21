import { useContext, useState } from "react";
import { END_POINTS } from "../API/api-endpoints";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

export default function Login() {
    const [identifer, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const stateActions = useContext(AuthContext);
    const navTo = useNavigate();
    async function handleLogin() {
        const response = await fetch(END_POINTS.login, {
            method: 'POST',
            credentials: 'include',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                identifier: identifer,
                password: password
            })
        });
        const parsed = await response.json();
        console.log(parsed.res.isSuccess)
        if (parsed.res.isSuccess) {
            stateActions?.setUser(parsed.res.data);
            stateActions?.setStatus('success');
            navTo('/dashboard')
        } else {
            alert(`failed bacause: ${parsed.res.isSuccess}, try again1`);
        }
    };
    return (
        <form className="flex flex-col justify-center items-center gap-4 text-white h-full w-full">
            <div className="flex flex-col gap-2">
                <label htmlFor="identifier">Enter email or username</label>
                <input type="text" id="identifier"
                    className="bg-slate-500 text-slate-50 p-2 rounded"
                    placeholder="Username | E-mail"
                    value={identifer}
                    onChange={(e) => setIdentifier(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="password">Enter password</label>
                <input type="password" id="password"
                    className="bg-slate-500 text-slate-50 p-2 rounded"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="flex gap-4">
                <button className="bg-rose-400 text-rose-950 py-2 px-6 rounded">Clear</button>
                <button type="button" className="bg-fuchsia-400 text-fuchsia-950 py-2 px-6 rounded" onClick={handleLogin}>Login</button>
            </div>
        </form>
    )
}