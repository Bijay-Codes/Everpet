import { useMemo, useState, type ReactNode } from "react"
import petsContext from "./pets-context"
import type { PetsContext } from "../types/pets-context";
export default function PetsProvider({ children }: { children: ReactNode }) {
    const [pets, setPetsList] = useState<PetsContext['pets']>([]);

    const values = useMemo(() => {
        return ({ pets: pets, setPetsList: setPetsList });
    }, [pets]);

    return (
        <petsContext.Provider value={values}>
            {children}
        </petsContext.Provider>
    )
};