import { useCallback, useContext, useEffect, useRef, useState, type SetStateAction } from "react";
import type { SpeciesObj } from "../types/species-obj";
import useHandleFetch from "../hooks/useHandleFetch";
import fetchSpeciesCreatable from "../API/fetch-creatable-species";
import { AuthContext } from "../context/auth-context";
import Input from "./input";
import fetchCreatePet from "../API/fetch-create-pet";
import PetContext from "../context/pets-context";
import type { PetData } from "../types/pets-context";
import Pet from "./pet-card";


export default function SpeciesCreationForm() {
    const [selectedSpecies, setSelected] = useState<null | SpeciesObj>(null);
    const popup = useRef<null | HTMLDialogElement>(null);
    const user = useContext(AuthContext);
    if (!user)
        throw new Error('Auth context not set up properly or not provided here');
    const accessToken = user.userInfo?.accessToken ?? '';
    const petContextData = useContext(PetContext);
    if (!petContextData)
        throw new Error('Pets context not set up properly or not provided here');
    const { pets } = petContextData;

    return (
        <section className="flex flex-col gap-6 bg-surface-bg text-surface-fg p-10">
            <SpeciesSlider setSelected={setSelected} accessToken={accessToken} />
            <Popup popup={popup} accessToken={accessToken} selectedSpecies={selectedSpecies} />
            <button
                onClick={() => popup.current?.show()}
                className="bg-accent-bg py-2 px-4 rounded-full"
            >Create {selectedSpecies?.name}
            </button>
            {selectedSpecies && <SpeciesInfo selectedSpecies={selectedSpecies} />}
            <section>
                <span>Created Pets : : </span>
                <section className="flex flex-wrap gap-6">
                    {pets.map(pet => (
                        <Pet accessToken={accessToken} pet={pet} />
                    ))}
                </section>
            </section>
        </section>
    );
};

function SpeciesSlider({ setSelected, accessToken }: { setSelected: React.Dispatch<SetStateAction<SpeciesObj | null>>, accessToken: string }) {
    const setSpecies = useCallback((speciesObj: SpeciesObj) => setSelected(speciesObj)
        , [setSelected]);
    const [index, setIndex] = useState<number>(0);

    const { response, isPending, hasError, reset, runFetch } = useHandleFetch(() => fetchSpeciesCreatable(accessToken));

    const configList = response as SpeciesObj[];
    useEffect(() => {
        if (isPending || response)
            return;
        runFetch();
        console.log(response)
        reset()
    }, [runFetch, isPending, response, reset]);

    const move = (dir: 'prev' | 'next') => {
        if (!response || !configList || hasError)
            return;
        switch (dir) {
            case ('next'):
                return setIndex(prev => prev >= configList.length - 1 ? 0 : prev + 1);
            case ('prev'):
                return setIndex(prev => prev <= 0 ? configList.length - 1 : prev - 1);
        };
    };

    useEffect(() => {
        if (!configList?.length)
            return;
        setSpecies(configList[index]);
    }, [index, setSpecies, configList]);
    const sharedStyles = {
        navButtons: 'bg-card-bg rounded h-10 w-10 inline-flex justify-center items-center p-4 outline outline-accent-bg hover:bg-accent-bg'
    }
    return (
        <section>
            <div className="flex gap-4 items-center w-full">
                <button className={sharedStyles.navButtons} onClick={() => move('prev')} disabled={hasError || !response}>&lt;</button>
                {
                    configList && !isPending &&
                    <span className="capitalize font-bold outline-2 outline-accent-bg text-accent-fg py-2 rounded flex-1 text-center">
                        {configList[index]?.name}
                    </span>
                }
                <button className={sharedStyles.navButtons} onClick={() => move('next')} disabled={hasError || !response}>&gt;</button>
            </div>
        </section>
    );
};


function SpeciesInfo({ selectedSpecies }: { selectedSpecies: SpeciesObj }) {
    return (
        <section className="p-6 rounded-lg outline outline-accent-bg">
            <div className="flex gap-4">
                <span className="capitalize font-extrabold">{selectedSpecies.name}</span>
                <span>||</span>
                <span className="capitalize">{selectedSpecies.diet}</span>
            </div>
            <div>
                {selectedSpecies.lifespanDays / 30} month
            </div>
            <div>
                <span>Bond decrease : </span>
                <span>{selectedSpecies.bondDecayPerTick} / tick</span>
            </div>
            <div>
                <span>Stress increase : </span>
                <span>{selectedSpecies.stressIncreasePerTick} / tick</span>
            </div>
        </section>
    );
};

function Popup({ popup, accessToken, selectedSpecies }: { popup: React.RefObject<HTMLDialogElement | null>, accessToken: string, selectedSpecies: SpeciesObj | null }) {
    const [name, setName] = useState<string>('');
    const info = {
        accessToken,
        name: name,
        species: selectedSpecies?.name ?? ''
    };

    const petsInfo = useContext(PetContext);
    if (!petsInfo)
        throw new Error('Pet context not provided');
    const { pets, setPetsList } = petsInfo;

    const { response, isPending, runFetch, hasError, reset } = useHandleFetch(() => fetchCreatePet(info));
    useEffect(() => {
        if (isPending || !response)
            return;
        if (hasError) {
            popup?.current?.close();
            return resetResponseAfter(6, reset);
        };

        setPetsList(prev => [response as PetData, ...prev]);
        reset();
        popup?.current?.close();
    }, [isPending, response, hasError, reset, popup, setPetsList, pets]);


    return (
        <dialog ref={popup} className="bg-transparent h-dvh w-dvw"
            onClick={() => popup.current?.close()}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-100 rounded-lg p-10 m-auto bg-surface-muted-bg text-surface-muted-fg outline outline-accent-bg flex flex-col gap-2">
                <Input name="Pet-Name" type="text" label="Enter pet name" id="pet-name"
                    val={name} onChange={(e) => setName(e.target.value)} hasLimit={40}
                />
                <button className="outline-accent-bg outline hover:outline-none hover:bg-accent-bg py-2 px-4 rounded-full" onClick={runFetch}>{isPending ? 'Creating' : 'Create'}</button>
            </div>
        </dialog>
    );
};

function resetResponseAfter(dur: number, reset: () => void) {
    const id = setTimeout(() => {
        reset();
    }, (dur * 1000))
    return () => clearTimeout(id);
};