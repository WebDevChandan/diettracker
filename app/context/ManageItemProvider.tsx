import { FoodItemType } from "@/types/FoodItem";
import { AllCategory } from "@prisma/client";
import { createContext, Dispatch, SetStateAction, useState } from "react";

type ManageItemType = {
    foodItem: FoodItemType;
    setFoodItem: Dispatch<SetStateAction<FoodItemType>>
}
export const ManageItemContext = createContext<ManageItemType>({
    foodItem: {
        name: "",
        currentWeight: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        amountPer: 0,
        category: {
            name: AllCategory.breakfast
        }
    },
    setFoodItem: () => { },
});

export default function ManageItemProvider({ itemToManage, children }: { itemToManage: FoodItemType, children: React.ReactNode }) {
    const [foodItem, setFoodItem] = useState<FoodItemType>(itemToManage);

    return (
        <ManageItemContext.Provider value={{ foodItem, setFoodItem }}>
            {children}
        </ManageItemContext.Provider>
    )
}
