import type { SetStateAction } from "react";
import type { ErrorResponse } from "./auth-responses";

export type PetsContext = {
    pets: PetData[];
    setPetsList: React.Dispatch<SetStateAction<PetData[]>>
};

export type DietType = "carnivore" | "herbivore" | "omnivore";

export type PetResponse = {
    isSuccess: boolean;
    data: PetData | null | undefined;
    err?: ErrorResponse;
};

export interface PetData {
    id: string;
    ownerID: string | null;
    name: string;
    char: {
        species: string;
        lifespan: number;   // years
        age: Date;
        diet: DietType;
        dateOfDeath: Date;
        reasonOfDeath: string;
        sicknessStartedAt: Date;
    };
    state: {
        isHungry: boolean;
        asleep: boolean;
        isSick: boolean;
        isHealing: boolean;
        isDead: boolean;
    };
    stats: {
        hp: number;
        maxHp: number;
        appetite: number;
        caloriesNeeded: number;
        caloriesConsumed: number;
        bond: number;
        stress: number;
        daysUnderfed: number;
        sicknessLiftAt: Date;
    };
    lastTickedAt: Date;
};
