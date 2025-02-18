import { AllCategory } from "@prisma/client";

export type DietType = {
    id?: string;
    name: string;
    currentWeight: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
    amountPer: number;
    category: AllCategory,
    listed: boolean;
}[]