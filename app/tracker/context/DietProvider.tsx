"use client";
import { DietType } from "@/types/Diet";
import { FoodItemType } from "@/types/FoodItem";
import { calNutrientFormula } from "@/utils/calNutrientFormula";
import { AllCategory } from "@prisma/client";
import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";

type SubTotalType = {
    breakfast: DietType[0],
    lunch: DietType[0],
    dinner: DietType[0],
    snacks: DietType[0],
    other: DietType[0],
}
type DietContextType = {
    diet: DietType
    setDiet: Dispatch<SetStateAction<DietType>>;
    newFoodItem: FoodItemType,
    setNewFoodItem: Dispatch<SetStateAction<FoodItemType>>;
    totalConsumed: DietType[0],
    setTotalConsumed: Dispatch<SetStateAction<DietType[0]>>;
    subTotalConsumed: SubTotalType,
    setSubTotalConsumed: Dispatch<SetStateAction<SubTotalType>>;
};

export const DietContext = createContext<DietContextType>({
    diet: [],
    setDiet: () => { },

    newFoodItem: {
        id: '',
        name: '',
        calories: 0,
        currentWeight: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        amountPer: 100,
        category: [] as AllCategory[],
        listed: false,
        listed_item_id: '',
    },
    setNewFoodItem: () => { },
    totalConsumed: {
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
    setTotalConsumed: () => { },

    subTotalConsumed: {
        breakfast: {
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
        lunch: {
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
        dinner: {
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
        snacks: {
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
        other: {
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

    },
    setSubTotalConsumed: () => { },
});

export default function DietProvider({ children, dietData }: { children: ReactNode, dietData: DietType }) {
    const [newFoodItem, setNewFoodItem] = useState<FoodItemType>({
        id: '',
        name: '',
        calories: 0,
        currentWeight: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        amountPer: 100,
        category: [] as AllCategory[],
        listed: false,
        listed_item_id: '',
    });

    const [diet, setDiet] = useState<DietType>(dietData);
    
    const [totalConsumed, setTotalConsumed] = useState<DietType[0]>({
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

    const [subTotalConsumed, setSubTotalConsumed] = useState<SubTotalType>({
        breakfast: {
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
        lunch: {
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
        dinner: {
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
        snacks: {
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
        other: {
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
    });

    return (
        <DietContext.Provider value={{
            diet,
            newFoodItem,
            setNewFoodItem,
            setDiet,
            totalConsumed,
            setTotalConsumed,
            subTotalConsumed,
            setSubTotalConsumed,
        }}>
            {children}
        </DietContext.Provider >
    )
}
