import { useContext, useEffect, useState, type SetStateAction } from "react";
import Input from "./input";
import fetchSpeciesCreatable from "../API/fetch-creatable-species";
import type { SpeciesObj } from "../types/species-obj";
import { AuthContext } from "../context/auth-context";
import useHandleFetch from "../hooks/useHandleFetch";
import fetchCreatePet from "../API/fetch-create-pet";
import type { PetData } from "../types/pets-context";
import PetContext from "../context/pets-context";
import type { ErrorResponse } from "../types/auth-responses";

function handleResponse(
    response: PetData | ErrorResponse | null,
    setPetsList: React.Dispatch<SetStateAction<PetData[]>>,
    hasError: boolean,
    setErrorResponse: React.Dispatch<SetStateAction<ErrorResponse | null>>) {
    if (!response) return;
    if (hasError) {
        setErrorResponse(response as ErrorResponse);
    } else {
        setErrorResponse(null);
        setPetsList(prev => [...prev, response as PetData]);
    };
};

function checkFeilds(
    name: string | null,
    selectedSpecies: SpeciesObj | null,
    species: SpeciesObj[],
    accessToken: string
) {
    if (!name || !selectedSpecies || species.length <= 0) {
        return null;
    }

    if (name.length > 40 || !selectedSpecies.name)
        return null;

    const obj = {
        name,
        species: selectedSpecies.name,
        accessToken
    };

    return fetchCreatePet(obj);
};

export default function CreatePetSection() {

    const [name, setName] = useState('');
    const [species, setSpecies] = useState<SpeciesObj[]>([]);
    const [selectedSpecies, setSelected] = useState<SpeciesObj | null>(null);

    const petContext = useContext(PetContext);

    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
    console.log(errorResponse);
    if (!petContext)
        throw new Error('Pet context not set up or not providing the required value');

    const { pets, setPetsList } = petContext;
    if (!setPetsList || !pets)
        throw new Error('Pet function OR Value from pet context could not be found or accessed');

    const accessToken = useContext(AuthContext)?.userInfo?.accessToken;
    if (!accessToken)
        throw new Error('Auth context not set up or not providing the required value');

    const { response, isPending, fetch, hasError, reset } =
        useHandleFetch(() =>
            checkFeilds(name, selectedSpecies, species, accessToken));


    console.log(response)
    useEffect(() => {
        async function handleSpecies() {
            const data = await fetchSpeciesCreatable(accessToken ?? '');
            setSpecies(data);
            setSelected(data[0] ?? null);
        };
        handleSpecies();
    }, [accessToken]);

    useEffect(() => {
        if (!response)
            return;
        handleResponse(
            response as PetData | ErrorResponse,
            setPetsList,
            hasError,
            setErrorResponse
        );
        reset();
    }, [hasError, setErrorResponse, response, setPetsList, reset]);

    return (
        <main className="flex flex-col gap-6">
            <section>
                <div className="flex flex-col gap-4 w-fit">
                    <Input type={'text'}
                        label="Pet name" name="Pet-name" id="Pet-name"
                        val={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </section>
            <section>
                <SpeciesList species={species} selectedSpecies={selectedSpecies} setSelected={setSelected} />
                {selectedSpecies &&
                    <SpeciesSelected selectedSpecies={selectedSpecies} />
                }
            </section>
            <button
                onClick={() => name ? fetch() : ''}
                className="w-fit py-2 px-6 bg-accent-bg rounded">
                {isPending ? 'Processing' : 'Create'}
            </button>


            {pets.length > 0 && (
                <div className="flex flex-wrap gap-6 items-center">
                    {pets.map(anim =>
                        <div key={anim.id}>
                            <Pet pet={anim} />
                        </div>
                    )}
                </div>
            )}
        </main >
    );
};


function SpeciesList({ species, selectedSpecies, setSelected }: { species: SpeciesObj[], selectedSpecies: SpeciesObj | null, setSelected: React.Dispatch<SetStateAction<SpeciesObj | null>> }) {
    return (
        <div className="flex gap-4 max-w-200 flex-wrap">
            {
                species.length > 0 && (
                    species.map(anim =>
                        <div key={anim.name}>
                            <div onClick={() => setSelected(anim)}
                                className={`py-1 px-4 rounded
                     ${selectedSpecies?.name === anim.name ? 'bg-accent-bg/20 outline outline-accent-bg' : 'bg-card-bg'}`}>
                                <span className="capitalize" >{anim.name}</span>
                            </div>

                        </div>
                    )
                )
            }
        </div>
    )
};


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


function Pet({ pet }: { pet: PetData }) {
    const { name, char, state, stats
    } = pet;
    const { species, lifespan, sicknessStartedAt, diet } = char;
    const { isSick, isDead, isHealing, isHungry } = state;
    const { sicknessLiftAt, caloriesConsumed, caloriesNeeded, bond, stress, appetite, daysUnderfed, hp, maxHp } = stats;

    const header = 'text-3xl font-extrabold'
    const subtext = 'text-lg font-medium inline-flex items-center'
    return (
        <div className="bg-card-bg p-6 flex flex-col gap-6 min-w-50">
            {/* basic info section */}
            <section className="flex flex-col gap-4">
                <span className={header}>{name}</span>
                <div className="flex gap-2">
                    <span className='text-2xl font-medium'>{species}</span>
                    <span className='text-2xl font-medium'> | {diet}</span>
                </div>
                <span>Expected to live {Number(lifespan) / 30} months</span>
            </section>

            {/* status effects section */}
            <section>
                {isDead && (
                    <span>{name} is long gone but never truly left us</span>
                )}
                {isSick && !isHealing && (
                    <span>{name} is Sick!</span>
                )}
                {isSick && isHealing && (
                    <div>
                        <span>Sick since {sicknessStartedAt.getHours()} hours</span>
                        <span>{name} is Expected to heal at {sicknessLiftAt.toLocaleString()}</span>
                    </div>
                )}
                {isHungry && (
                    <span>{name} is hungry!</span>
                )}

            </section>


            <section className="flex flex-col gap-1">
                <div className="flex gap-2">
                    <span>Hp / Max Hp : </span>
                    <span className={subtext}>{hp} / {maxHp}</span>
                </div>
                <div>
                    <div>
                        <span>cal consumed / cal needed : </span>
                        <span className={subtext}>{caloriesConsumed} / {caloriesNeeded}</span>
                    </div>

                    {daysUnderfed > 0 && (
                        <div>
                            <span>Days Underfed</span>
                            <span>{daysUnderfed}</span>
                        </div>
                    )}

                    <div>
                        <span>Appetite : </span>
                        <span className={subtext}>{appetite} / 100</span>
                    </div>

                </div>
                <div>
                    <div>
                        <span>Bond : </span>
                        <span className={subtext}>{bond} / 100</span>
                    </div>
                    <div>
                        <span>Stress : </span>
                        <span className={subtext}>{stress} / 100</span>
                    </div>
                </div>
            </section>
            <section className="flex gap-4">
                <button className="py-2 px-4 bg-white text-pink-800 rounded outline outline-accent-bg">Feed</button>
                <button className="py-2 px-4 bg-white text-pink-800 rounded outline outline-accent-bg">Interact</button>
                <button className="py-2 px-4 bg-white text-pink-800 rounded outline outline-accent-bg">Pet</button>
            </section>
        </div>
    );
};