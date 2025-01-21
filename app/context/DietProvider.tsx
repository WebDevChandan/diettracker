"use client";
import { DietType } from "@/types/Diet";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"

type DietContextType = {
    diet: DietType
    setDiet: Dispatch<SetStateAction<DietType>>;
};

export const DietContext = createContext<DietContextType>({
    diet: [],
    setDiet: () => { },
});

export default function DietProvider({ children, dietData }: { children: ReactNode, dietData: DietType }) {
    const [diet, setDiet] = useState<DietType>(dietData);

    return (
        <DietContext.Provider value={{
            diet,
            setDiet,
        }}>
            {children}
        </DietContext.Provider >
    )
}
