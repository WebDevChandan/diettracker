"use client";
import { Dialog } from "@/components/ui/dialog";
import useDialog from "@/hooks/useDialog";
import { FoodItemType } from "@/types/FoodItem";
import { ReactNode } from "react";

export default function EditFoodItem({ triggerElement, itemToEdit }: { triggerElement: ReactNode, itemToEdit: FoodItemType }) {
    const { isDialogOpen, setIsDialogOpen, FoodItemDialog } = useDialog();

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <FoodItemDialog
                dialogTitle={`Edit Nutrients for ${itemToEdit.name}`}
                dialogDesc={
                    <>
                        Add <b>Intake Weight (g)</b> or Update Item as <b>Amount Per (g)</b>
                    </>
                }
                triggerElement={triggerElement}
                tooltipContent={`Edit ${itemToEdit.name}`}
                currentCategory={itemToEdit.category[0]}
                isNewItem={false}
                itemToManage={itemToEdit}
            />
        </Dialog>
    )
}
