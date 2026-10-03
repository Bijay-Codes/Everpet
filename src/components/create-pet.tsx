import { useContext, useEffect, useRef, useState } from "react";
import Input from "./input";
import fetchSpeciesCreatable from "../API/fetch-creatable-species";
import type { SpeciesObj } from "../types/species-obj";
import { AuthContext } from "../context/auth-context";

export default function CreatePet() {
    const [name, setName] = useState('');
    const isPending = useRef(false);

    const [species, setSpecies] = useState<SpeciesObj[]>([]);
    const accessToken = useContext(AuthContext)?.userInfo?.accessToken;
    if (accessToken === null || !accessToken)
        throw new Error('Auth context not set up or not providing the required value');

    useEffect(() => {
        async function handleSpecies() {
            if (isPending.current)
                return;
            isPending.current = true;
            const data = await fetchSpeciesCreatable(accessToken ?? '');
            setSpecies(data);
        }
        handleSpecies();
    }, [accessToken]);

    return (
        <main>
            <form action="" className="flex flex-col gap-6">
                <Input type={'text'}
                    label="Pet name" name="Pet-name" id="Pet-name"
                    val={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="species-dropdown">Species : </label>
                <select name="species-dropdown" id="species-dropdown" className="bg-card-bg p-2 rounded">
                    {species.length > 1 &&
                        species.map(anim => (
                            <option>{anim.name}</option>
                        ))
                    }
                </select>

                <button className="w-fit bg-accent-bg py-1 px-4 rounded">Create</button>
            </form>
        </main>
    );
};