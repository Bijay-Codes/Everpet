import { createContext } from "react";
import type { PetsContext } from "../types/pets-context";

const PetContext = createContext<PetsContext | null>(null);

export default PetContext;