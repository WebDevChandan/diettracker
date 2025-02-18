import { AllCategory } from "@prisma/client";

export type FoodItemType = {
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
}