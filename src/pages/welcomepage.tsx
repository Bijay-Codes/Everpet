import { useActionState, useEffect, useState } from "react"
import { END_POINTS } from "../paths/api-endpoints";

type responseStructure = {
    error: string;
    response: unknown;
}
async function checkSession(prev: responseStructure) {
    const res = await fetch(END_POINTS.refresh, {
        method: 'POST',
        credentials: 'include',
    })
    return prev;
}
export default function Welcome() {
    const [response, initialize, isPending] = useActionState(checkSession, { error: '', response: null });
    useEffect(() => {
        initialize();
    }, []);
    return (
        <section>
            <h1>Welcome to everpet - early version</h1>
            <p>Let me start the backend for you, please wait paitently</p>
            <button disabled={isPending}></button>
        </section>
    )
}