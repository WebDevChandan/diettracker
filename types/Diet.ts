import { AllCategory } from "@prisma/client";

export type DietType = {
    name: string;
    currentWeight: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
    amountPer: number;
    category: {
        name: AllCategory,
    }
}[]