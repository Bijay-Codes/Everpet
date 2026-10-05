import { useContext, useEffect, useRef, useState, type SetStateAction } from "react";
import Input from "./input";
import fetchSpeciesCreatable from "../API/fetch-creatable-species";
import type { SpeciesObj } from "../types/species-obj";
import { AuthContext } from "../context/auth-context";

export default function CreatePet() {

    const [name, setName] = useState('');
    const [species, setSpecies] = useState<SpeciesObj[]>([]);
    const [selectedSpecies, setSelected] = useState(species[0])
    const isPending = useRef(false);

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
            <section>

                <div className="flex flex-col gap-4 w-fit">
                    <Input type={'text'}
                        label="Pet name" name="Pet-name" id="Pet-name"
                        val={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 max-w-200 flex-wrap py-6">
                    {
                        species.length > 0 && (
                            species.map(anim =>
                                <div key={anim.name}>
                                    <Species species={anim} selectedSpecies={selectedSpecies} setSelected={setSelected} />
                                </div>
                            )
                        )
                    }
                </div>
                <button className="w-fit py-1 px-4 bg-mist-200 text-fuchsia-800 rounded">Create</button>
            </section>

            {selectedSpecies &&
                <SpeciesSelected selectedSpecies={selectedSpecies} />
            }
        </main >
    );
};


function Species({ species, selectedSpecies, setSelected }: { species: SpeciesObj, selectedSpecies: SpeciesObj | null, setSelected: React.Dispatch<SetStateAction<SpeciesObj>> }) {
    return (
        <>
            {species &&
                <div onClick={() => setSelected(species)}
                    className={`py-1 px-4 rounded
                     ${selectedSpecies?.name === species.name ? 'bg-status-success' : 'bg-card-bg'}`}
                >
                    <span className="capitalize" >{species.name}</span>
                </div>}
        </>
    )
}


function SpeciesSelected({ selectedSpecies }: { selectedSpecies: SpeciesObj }) {
    return (
        <article className="bg-card-bg px-6 py-4 max-w-100 rounded outline outline-amber-200/40 mt-6">
            {selectedSpecies &&
                <div>
                    <span className="capitalize">{selectedSpecies.name}</span>
                    <div>
                        <span>Diet - </span>
                        <span>{selectedSpecies.diet}</span>
                    </div>
                    <div>
                        <span>Expected lifespan - </span>
                        <span>{selectedSpecies.lifespan / 30} months</span>
                    </div>
                    <div>
                        <span></span>
                    </div>
                </div>
            }
        </article>
    )
}