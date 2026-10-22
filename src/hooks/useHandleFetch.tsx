import { useCallback, useState } from "react";
import type { ErrorResponse } from "../types/auth-responses";

function useHandleFetch(
    callBack: () => Promise<Response>) {
    const [isPending, setPending] = useState<boolean>(false);
    const [response, setResponse] = useState<unknown>(null);
    const [hasError, setHasError] = useState<boolean>(false);

    const reset = useCallback(() => {
        setResponse(null);
        setHasError(false);
    }, []);

    const runFetch = useCallback(async () => {
        setPending(true);
        reset();
        try {
            const response = await callBack();
            const parsed = await response.json();

            if (parsed.isSuccess) {
                setResponse(parsed.data);
            } else {
                setHasError(true);
                setResponse(parsed.res.err as ErrorResponse);
            };
        } catch {
            setHasError(true);
            setResponse({
                message: 'Something went wrong with parsing the response',
                code: 500
            } as ErrorResponse);
        };
        setPending(false);

    }, [callBack, reset]);
    return { response, isPending, runFetch, hasError, reset };
};

export default useHandleFetch;