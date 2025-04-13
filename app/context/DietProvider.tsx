"use client";
import { DietType } from "@/types/Diet";
import { AllCategory } from "@prisma/client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type DietContextType = {
    diet: DietType
    setDiet: Dispatch<SetStateAction<DietType>>;
    total: DietType[0],
    setTotal: Dispatch<SetStateAction<DietType[0]>>;
};

export const DietContext = createContext<DietContextType>({
    diet: [],
    setDiet: () => { },
    total: {
        id: "total-id",
        name: "Total",
        currentWeight: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        amountPer: 0,
        category: [AllCategory.breakfast, AllCategory.lunch, AllCategory.dinner, AllCategory.snacks, AllCategory.other] as AllCategory[],
        listed: false,
        listed_item_id: "total-listed-id"
    },
    setTotal: () => { },
});

export default function DietProvider({ children, dietData }: { children: ReactNode, dietData: DietType }) {
    const [diet, setDiet] = useState<DietType>(dietData);
    const [total, setTotal] = useState<DietType[0]>({
        id: "total-id",
        name: "Total",
        currentWeight: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        amountPer: 0,
        category: [AllCategory.breakfast, AllCategory.lunch, AllCategory.dinner, AllCategory.snacks, AllCategory.other] as AllCategory[],
        listed: false,
        listed_item_id: "total-listed-id"
    } as DietType[0]);

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
