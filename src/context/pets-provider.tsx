import { useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type SetStateAction } from "react"
import petsContext from "./pets-context"
import type { MultiPetResponse, PetData, PetsContext } from "../types/pets-context";
import useHandleFetch from "../hooks/useHandleFetch";
import fetchAllPets from "../API/fetch-all-user-pets";
import { AuthContext } from "./auth-context";
import Toast from "../components/toasts";
import type { ErrorResponse } from "../types/auth-responses";


export default function PetsProvider({ children }: { children: ReactNode }) {
    const [pets, setPetsList] = useState<PetsContext['pets']>([]);
    const offset = useRef<number>(0);
    const durationSeconds = 6;

    const userData = useContext(AuthContext)?.userInfo;
    if (!userData)
        throw new Error('Auth context not set up properly');
    const { accessToken } = userData;
    if (!accessToken)
        throw new Error('Auth context not set up properly or not providing the access token');

    const callback = useCallback(() => {
        return fetchAllPets(offset.current, 20, accessToken);
    }, [accessToken]);

    const { response, isPending, runFetch, hasError, reset } = useHandleFetch(callback);
    const errorResponse = response as ErrorResponse;

    useEffect(() => {
        runFetch();
    }, [runFetch]);

    useEffect(() => {
        const res = response as MultiPetResponse;
        if (isPending || !res)
            return;

        if (hasError)
            return resetResponseAfter(durationSeconds, reset);

        const petsList = res.data;
        if (petsList?.length)
            updatePetsList(offset, petsList, setPetsList);

        reset();
    }, [response, isPending, hasError, reset]);

    const values = useMemo(() => {
        return ({ pets, setPetsList });
    }, [pets]);

    return (
        <petsContext.Provider value={values}>
            {children}
            {hasError &&
                !isPending &&
                <Toast
                    type={errorResponse.code === 404 ? 'info' : 'err'}
                    seconds={durationSeconds}
                    errorResponse={errorResponse}
                />}
        </petsContext.Provider>
    )
};


function updatePetsList(offset: React.RefObject<number>, list: PetData[], setList: React.Dispatch<SetStateAction<PetData[]>>) {
    setList(prev => [...prev, ...list]);
    offset.current += list.length;
};

function resetResponseAfter(durationSeconds: number, reset: () => void) {
    const id = setTimeout(() => {
        reset();
    }, (durationSeconds * 1000));
    return () => clearTimeout(id);
};
