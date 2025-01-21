"use client";
import { DietType } from "@/types/Diet";
import { createContext, ReactNode, SetStateAction, useState } from "react"

type DietContextType = DietType & {
    setDiet: React.Dispatch<SetStateAction<DietType>>;
};

export const DietContext = createContext<DietContextType | undefined>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
    other: [],
    setDiet: () => { },
});

export default function DietProvider({ children, dietData }: { children: ReactNode, dietData: DietType }) {
    const [diet, setDiet] = useState<DietType>(dietData);

    return (
        <DietContext.Provider value={{
            ...diet,
            setDiet,
        }}>
            {children}
        </DietContext.Provider >
    )
}
