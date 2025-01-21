
export type AllDietType = {
    food_item: string;
    current_weight: number;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    sugar: number;
    amount_per: number;
}[]

export type DietType = {
    breakfast: AllDietType,
    lunch: AllDietType,
    dinner: AllDietType,
    snacks: AllDietType,
    other: AllDietType,
}