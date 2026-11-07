import { useCallback, useContext, useEffect, useState } from "react";
import fetchStorePets from "../API/fetch-storepets";
import useHandleFetch from "../hooks/useHandleFetch";
import { AuthContext } from "../context/auth-context";
import type { PetData } from "../types/pets-context";
import Pet from "./pet-card";

export default function Store() {
    const userInfo = useContext(AuthContext);
    if (!userInfo)
        throw new Error('Auth context not set up properly');
    const accessToken = userInfo.userInfo?.accessToken;
    if (!accessToken)
        throw new Error('AccessToken not set in auth context');
    const [storeList, setList] = useState<PetData[]>([]);
    const offset = storeList.length;
    const getStorePets = useCallback(() => fetchStorePets(accessToken, offset), [accessToken, offset]);
    const { response, isPending, hasError, runFetch, reset } = useHandleFetch(getStorePets);

    useEffect(() => {
        runFetch();
    }, [runFetch]);

    useEffect(() => {
        if (isPending || !response)
            return;
        if (hasError)
            return;

        setList(prev => [...response as PetData[], ...prev]);

        reset();
    }, [response, isPending, hasError, reset]);
    return (
        <main>
            <span>Pets in store : : </span>
            <div className="flex flex-wrap gap-6">
                {storeList.length > 0 && !isPending ?
                    (storeList.map(pet =>
                        <Pet pet={pet} accessToken={accessToken} />
                    ))
                    :
                    (<span>No pets exist</span>)
                }
            </div>
        </main>
    );
};