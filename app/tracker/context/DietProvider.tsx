"use client";
import { DietType } from "@/types/Diet";
import { calNutrientFormula } from "@/utils/calNutrientFormula";
import { AllCategory } from "@prisma/client";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { set } from "zod";

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
    totalConsumed: DietType[0],
    setTotalConsumed: Dispatch<SetStateAction<DietType[0]>>;
    subTotalConsumed: SubTotalType,
    setSubTotalConsumed: Dispatch<SetStateAction<SubTotalType>>;
};

export const DietContext = createContext<DietContextType>({
    diet: [],
    setDiet: () => { },
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

    useEffect(() => {
        const calculateTotal = (dietItems: DietType) => {
            if (dietItems.length === 0) return totalConsumed;

            return {
                ...totalConsumed,
                currentWeight: dietItems.reduce((acc, curr) => acc + curr.currentWeight, 0),
                calories: dietItems.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.calories, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                protein: dietItems.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.protein, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                carbs: dietItems.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.carbs, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                fat: dietItems.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.fat, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                sugar: dietItems.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.sugar, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
            };
        };

        const calculateSubTotal = (dietItems: DietType) => {
            if (dietItems.length === 0) return subTotalConsumed;

            return {
                ...subTotalConsumed,
                breakfast: {
                    ...subTotalConsumed.breakfast,
                    currentWeight: dietItems.filter(item => item.category.includes(AllCategory.breakfast)).reduce((acc, curr) => acc + curr.currentWeight, 0),
                    calories: dietItems.filter(item => item.category.includes(AllCategory.breakfast)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.calories, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    protein: dietItems.filter(item => item.category.includes(AllCategory.breakfast)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.protein, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    carbs: dietItems.filter(item => item.category.includes(AllCategory.breakfast)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.carbs, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    fat: dietItems.filter(item => item.category.includes(AllCategory.breakfast)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.fat, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    sugar: dietItems.filter(item => item.category.includes(AllCategory.breakfast)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.sugar, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                },
                lunch: {
                    ...subTotalConsumed.lunch,
                    currentWeight: dietItems.filter(item => item.category.includes(AllCategory.lunch)).reduce((acc, curr) => acc + curr.currentWeight, 0),
                    calories: dietItems.filter(item => item.category.includes(AllCategory.lunch)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.calories, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    protein: dietItems.filter(item => item.category.includes(AllCategory.lunch)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.protein, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    carbs: dietItems.filter(item => item.category.includes(AllCategory.lunch)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.carbs, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    fat: dietItems.filter(item => item.category.includes(AllCategory.lunch)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.fat, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    sugar: dietItems.filter(item => item.category.includes(AllCategory.lunch)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.sugar, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                },
                dinner: {
                    ...subTotalConsumed.dinner,
                    currentWeight: dietItems.filter(item => item.category.includes(AllCategory.dinner)).reduce((acc, curr) => acc + curr.currentWeight, 0),
                    calories: dietItems.filter(item => item.category.includes(AllCategory.dinner)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.calories, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    protein: dietItems.filter(item => item.category.includes(AllCategory.dinner)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.protein, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    carbs: dietItems.filter(item => item.category.includes(AllCategory.dinner)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.carbs, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    fat: dietItems.filter(item => item.category.includes(AllCategory.dinner)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.fat, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    sugar: dietItems.filter(item => item.category.includes(AllCategory.dinner)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.sugar, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                },
                snacks: {
                    ...subTotalConsumed.snacks,
                    currentWeight: dietItems.filter(item => item.category.includes(AllCategory.snacks)).reduce((acc, curr) => acc + curr.currentWeight, 0),
                    calories: dietItems.filter(item => item.category.includes(AllCategory.snacks)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.calories, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    protein: dietItems.filter(item => item.category.includes(AllCategory.snacks)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.protein, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    carbs: dietItems.filter(item => item.category.includes(AllCategory.snacks)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.carbs, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    fat: dietItems.filter(item => item.category.includes(AllCategory.snacks)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.fat, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    sugar: dietItems.filter(item => item.category.includes(AllCategory.snacks)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.sugar, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                },
                other: {
                    ...subTotalConsumed.other,
                    currentWeight: dietItems.filter(item => item.category.includes(AllCategory.other)).reduce((acc, curr) => acc + curr.currentWeight, 0),
                    calories: dietItems.filter(item => item.category.includes(AllCategory.other)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.calories, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    protein: dietItems.filter(item => item.category.includes(AllCategory.other)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.protein, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    carbs: dietItems.filter(item => item.category.includes(AllCategory.other)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.carbs, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    fat: dietItems.filter(item => item.category.includes(AllCategory.other)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.fat, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                    sugar: dietItems.filter(item => item.category.includes(AllCategory.other)).reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.sugar, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
                },
            };
        };

        setTotalConsumed(calculateTotal(diet));
        setSubTotalConsumed(calculateSubTotal(diet));

    }, [diet]);

    return (
        <DietContext.Provider value={{
            diet,
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
