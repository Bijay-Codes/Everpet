import { useCallback, useState } from "react";

function useHandleFetch(
    callBack: () => Promise<Response> | null) {
    const [isPending, setPending] = useState<boolean>(false);
    const [response, setResponse] = useState<unknown>(null);
    const [hasError, setHasError] = useState<boolean>(false);

    const reset = useCallback(() => {
        setResponse(null);
        setHasError(false);
    }, []);

    async function fetch() {
        setPending(true);
        const response = await callBack();
        try {
            if (response) {
                const parsed = await response.json();
                if (parsed.isSuccess) {
                    setHasError(false);
                    setResponse(parsed.data);
                } else {
                    setHasError(true);
                    setResponse(parsed.err)
                }
            }
        } catch {
            setHasError(true);
            setResponse({
                isSuccess: false,
                data: null,
                err: {
                    message: 'Something went wrong with parsing the response',
                    code: 500
                }
            })
        };
        setPending(false);

    };

    return { response, isPending, fetch, hasError, reset };
};

export default useHandleFetch