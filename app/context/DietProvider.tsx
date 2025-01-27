"use client";
import { DietType } from "@/types/Diet";
import { AllCategory } from "@prisma/client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"

type DietContextType = {
    diet: DietType
    setDiet: Dispatch<SetStateAction<DietType>>;
    total: Object,
    setTotal: Dispatch<SetStateAction<never[]>>;
};

export const DietContext = createContext<DietContextType>({
    diet: [],
    setDiet: () => { },
    total: {},
    setTotal: () => { },
});

export default function DietProvider({ children, dietData }: { children: ReactNode, dietData: DietType }) {
    const [diet, setDiet] = useState<DietType>(dietData);
    const [total, setTotal] = useState([]);

    return (
        <DietContext.Provider value={{
            diet,
            setDiet,
            total,
            setTotal,
        }}>
            {children}
        </DietContext.Provider >
    )
}
