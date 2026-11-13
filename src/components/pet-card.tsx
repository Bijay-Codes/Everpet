import { useCallback, useContext } from "react";
import fetchAbandonPet from "../API/fetch-abandon-pet";
import useHandleFetch from "../hooks/useHandleFetch";
import type { PetData } from "../types/pets-context";
import { formatFloat } from "../util/util";
import PetContext from "../context/pets-context";
import { fetchFeedPet } from "../API/fetch-feed-pet";
export default function Pet({ pet, accessToken, type }: { pet: PetData, accessToken: string, type: 'pet-store' | 'pet-card' }) {
    const { name, char, stats
    } = pet;
    const { species, lifespan, diet } = char;
    const { caloriesConsumed, caloriesNeeded, bond, stress, appetite, daysUnderfed, hp, maxHp } = stats;

    const petInfo = useContext(PetContext);
    if (!petInfo || !petInfo.setPetsList)
        throw new Error('PetContext not set up properly or not being able to accessed');

    const removeFromPetList = (id: string) => {
        petInfo.setPetsList(prev => prev.filter(pet => pet.id !== id));
    };

    const replacePetInList = useCallback((id: string, newPetData: PetData) => {
        petInfo.setPetsList(prev => prev.map(pet => pet.id === id ? newPetData : pet))
    }, [petInfo])

    const header = 'text-3xl font-extrabold';
    const subtext = 'text-lg font-medium inline-flex items-center';
    const { runFetch: abandon, isPending: abandoning, hasError: failedAbandon } = useHandleFetch(() => fetchAbandonPet(pet.id, accessToken));
    const { runFetch: feed, isPending: isFeeding, hasError: failedFeeding } = useHandleFetch(() => fetchFeedPet(pet.id, accessToken));
    return (
        <div className="bg-card-bg p-6 flex flex-col gap-6 min-w-50">
            {/* basic info section */}
            <section className="flex flex-col gap-4">
                <span className={header}>{name}</span>
                <div className="flex gap-2 text-2xl capitalize font-semibold">
                    <span>{species}</span>
                    <span> | {diet}</span>
                </div>
                <span>Expected to live {Number(lifespan) / 30} months</span>
            </section>

            <StatusPane pet={pet} />

            <section className="flex flex-col gap-1">
                <div className="flex gap-2">
                    <span>Hp / Max Hp : </span>
                    <span className={subtext}>{formatFloat(Number(hp))} / {Number(maxHp)}</span>
                </div>
                <div>
                    <div>
                        <span>cal consumed / cal needed : </span>
                        <span className={subtext}>{Number(caloriesConsumed)} / {Number(caloriesNeeded)}</span>
                    </div>

                    {daysUnderfed > 0 && (
                        <div>
                            <span>Days Underfed</span>
                            <span>{daysUnderfed}</span>
                        </div>
                    )}

                    <div>
                        <span>Appetite : </span>
                        <span className={subtext}>{Number(appetite)} / 100</span>
                    </div>

                </div>
                <div>
                    <div>
                        <span>Bond : </span>
                        <span className={subtext}>{formatFloat(Number(bond))} / 100</span>
                    </div>
                    <div>
                        <span>Stress : </span>
                        <span className={subtext}>{formatFloat(Number(stress))} / 100</span>
                    </div>
                </div>
            </section>

            {type === 'pet-card' &&
                <section className="flex gap-4">
                    <button
                        onClick={async () => {
                            const response = await feed();
                            if (!response)
                                return;
                            replacePetInList(pet.id, response as PetData);
                        }}
                        className="py-2 px-4 bg-white text-pink-800 rounded outline outline-accent-bg"
                    >{isFeeding ? 'Processing' : failedFeeding ? 'Retry' : 'Feed'}
                    </button>
                    <button
                        className="py-2 px-4 bg-white text-pink-800 rounded outline outline-accent-bg">Interact
                    </button>
                    <button
                        className="py-2 px-4 bg-white text-pink-800 rounded outline outline-accent-bg"
                        onClick={async () => {
                            const response = await abandon();
                            if (!response)
                                return;
                            removeFromPetList(pet.id);
                        }}>
                        {abandoning ? 'Processing' : failedAbandon ? 'Retry' : 'Abandon'}
                    </button>
                </section>
            }
            {type === 'pet-store' &&
                <button className="py-2 px-4 bg-white text-pink-800 rounded outline outline-accent-bg">Adopt</button>
            }
        </div>
    );
};

function StatusPane({ pet }: { pet: PetData }) {
    const { name } = pet;
    const { isSick, isDead, isHealing, isHungry } = pet.state;
    const { sicknessLiftAt } = pet.stats;
    const { sicknessStartedAt } = pet.char;
    return (
        <>
            {/* status effects section */}
            <section>
                {
                    isDead && (
                        <span>{name} is long gone but never truly left us</span>
                    )
                }
                {
                    isSick && !isHealing && (
                        <span>{name} is Sick!</span>
                    )
                }
                {
                    isSick && isHealing && (
                        <div>
                            <span>Sick since {sicknessStartedAt.getHours()} hours</span>
                            <span>{name} is Expected to heal at {sicknessLiftAt.toLocaleString()}</span>
                        </div>
                    )
                }
                {
                    isHungry && (
                        <span>{name} is hungry!</span>
                    )
                }

            </section >
        </>
    );
};