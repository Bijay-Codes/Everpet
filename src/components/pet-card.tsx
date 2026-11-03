import fetchAbandonPet from "../API/fetch-abandon-pet";
import type { PetData } from "../types/pets-context";
export default function Pet({ pet, accessToken }: { pet: PetData, accessToken: string }) {
    const { name, char, state, stats
    } = pet;
    const { species, lifespan, sicknessStartedAt, diet } = char;
    const { isSick, isDead, isHealing, isHungry } = state;
    const { sicknessLiftAt, caloriesConsumed, caloriesNeeded, bond, stress, appetite, daysUnderfed, hp, maxHp } = stats;

    const header = 'text-3xl font-extrabold';
    const subtext = 'text-lg font-medium inline-flex items-center';

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
                    <span className={subtext}>{Number(hp)} / {Number(maxHp)}</span>
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
                        <span className={subtext}>{Number(bond)} / 100</span>
                    </div>
                    <div>
                        <span>Stress : </span>
                        <span className={subtext}>{Number(stress)} / 100</span>
                    </div>
                </div>
            </section>
            <section className="flex gap-4">
                <button
                    className="py-2 px-4 bg-white text-pink-800 rounded outline outline-accent-bg"
                >Feed
                </button>
                <button
                    className="py-2 px-4 bg-white text-pink-800 rounded outline outline-accent-bg">Interact
                </button>
                <button
                    className="py-2 px-4 bg-white text-pink-800 rounded outline outline-accent-bg"
                    onClick={() => fetchAbandonPet(pet.id, accessToken)}>
                    Abandon
                </button>
            </section>
        </div>
    );
};
