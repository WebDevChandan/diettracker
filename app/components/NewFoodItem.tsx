"use client";
import { Dialog } from "@/components/ui/dialog";
import useDialog from "@/hooks/useDialog";
import { FoodItemType } from "@/types/FoodItem";
import { AllCategory } from "@prisma/client";
import { ReactNode } from "react";

export default function NewFoodItem({ currentCategory, triggerElement, tooltipText }: { currentCategory: AllCategory, triggerElement: ReactNode, tooltipText: string }) {
    const { isDialogOpen, setIsDialogOpen, FoodItemDialog } = useDialog();

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
        category: [currentCategory] as AllCategory[],
        listed: false,
        listed_item_id: '',
    }

    return (
        <Dialog>
            <FoodItemDialog
                dialogTitle={`Add Item for ${currentCategory}`}
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
        </Dialog>
    )
}
