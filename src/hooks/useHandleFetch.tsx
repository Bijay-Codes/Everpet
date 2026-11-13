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
        let resToReturn: unknown;
        setPending(true);
        reset();
        try {
            const serverResponse = await callBack();
            const parsed = await serverResponse.json();
            if (parsed.isSuccess) {
                setResponse(parsed.data);
                resToReturn = parsed.data;
            } else {
                setHasError(true);
                setResponse(parsed.err as ErrorResponse);
            };
        } catch {
            const ourGeneralErrResponse = {
                message: 'Something went wrong with parsing the response',
                code: 500
            };
            setHasError(true);
            setResponse(ourGeneralErrResponse);
        };
        setPending(false);
        return resToReturn;
    }, [callBack, reset]);
    return { response, isPending, runFetch, hasError, reset };
};

export default useHandleFetch;