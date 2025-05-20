"use client";
import { DietType } from "@/types/Diet";
import { calNutrientFormula } from "@/utils/calNutrientFormula";
import { AllCategory } from "@prisma/client";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

type DietContextType = {
    diet: DietType
    setDiet: Dispatch<SetStateAction<DietType>>;
    total: DietType[0],
    setTotal: Dispatch<SetStateAction<DietType[0]>>;
    subTotal: DietType[0],
    setSubTotal: Dispatch<SetStateAction<DietType[0]>>;
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
        category: [] as AllCategory[],
        listed: false,
        listed_item_id: "total-listed-id"
    },
    setTotal: () => { },
    subTotal: {
        id: "subtotal-id",
        name: "SubTotal",
        currentWeight: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        amountPer: 0,
        category: [] as AllCategory[],
        listed: false,
        listed_item_id: "subtotal-listed-id"
    },
    setSubTotal: () => { },
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
        category: [] as AllCategory[],
        listed: false,
        listed_item_id: "total-listed-id"
    } as DietType[0]);

    const [subTotal, setSubTotal] = useState<DietType[0]>({
        id: "subtotal-id",
        name: "SubTotal",
        currentWeight: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        amountPer: 0,
        category: [] as AllCategory[],
        listed: false,
        listed_item_id: "subtotal-listed-id"
    });

    useEffect(() => {
        const calculateTotal = (dietItems: DietType) => {
            if (dietItems.length === 0) return total;

            return {
                ...total,
                currentWeight: dietItems.reduce((acc, curr) => acc + curr.currentWeight, 0),
                calories: dietItems.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.calories, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                protein: dietItems.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.protein, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                carbs: dietItems.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.carbs, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                fat: dietItems.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.fat, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                sugar: dietItems.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.sugar, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
            };
        };

        setTotal(calculateTotal(diet));
    }, [diet]);

    return (
        <DietContext.Provider value={{
            diet,
            setDiet,
            total,
            setTotal,
            subTotal,
            setSubTotal,
        }}>
            {children}
        </DietContext.Provider >
    )
}
