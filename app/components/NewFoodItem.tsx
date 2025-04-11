"use client";
import useDialog from "@/hooks/useDialog";
import { FoodItemType } from "@/types/FoodItem";
import { AllCategory } from "@prisma/client";
import { ReactNode } from "react";

export default function NewFoodItem({ title, currentCategory, triggerElement, tooltipText }: { title: string, currentCategory: AllCategory[], triggerElement: ReactNode, tooltipText: string }) {
    const { FoodItemDialog } = useDialog();

    const newItem: FoodItemType = {
        id: '',
        name: '',
        calories: 0,
        currentWeight: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        amountPer: 100,
        category: [...currentCategory] as AllCategory[],
        listed: false,
        listed_item_id: '',
    }

    return (
        <FoodItemDialog
            dialogTitle={title}
            dialogDesc={
                <>
                    Add nutrients as <b>Amount Per (g)</b> from verified source
                </>
            }
            triggerElement={triggerElement}
            tooltipContent={tooltipText}
            currentCategory={currentCategory}
            isNewItem={true}
            itemToManage={newItem}
        />
    )
}
