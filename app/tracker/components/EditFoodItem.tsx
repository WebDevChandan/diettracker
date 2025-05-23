"use client";
import useDialog from "@/app/hooks/useDialog";
import { FoodItemType } from "@/types/FoodItem";
import { ReactNode } from "react";

export default function EditFoodItem({ triggerElement, itemToEdit }: { triggerElement: ReactNode, itemToEdit: FoodItemType }) {
    const { FoodItemDialog } = useDialog();

    return (
        <FoodItemDialog
            dialogTitle={`Edit Nutrients of ${itemToEdit.name}`}
            dialogDesc={
                <>
                    Add <b>Intake Weight (g)</b> or Update Item as <b>Amount Per (g)</b>
                </>
            }
            triggerElement={triggerElement}
            tooltipContent={`Edit ${itemToEdit.name}`}
            currentCategory={[itemToEdit.category[0]]}
            isNewItem={false}
            itemToManage={itemToEdit}
        />
    )
}
