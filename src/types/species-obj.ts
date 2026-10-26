export type DietType = "carnivore" | "herbivore" | "omnivore";
export interface SpeciesObj {
    name: string;
    lifespanDays: number;
    diet: DietType;
    caloriesNeeded: number;
    bondDecayPerTick: number;      // higher = loses bond faster, less "loyal"
    metabolicRatePerTick: number;  // higher = burns appetite faster
    stressIncreasePerTick: number;
    stressDecreasePetTick: number
};