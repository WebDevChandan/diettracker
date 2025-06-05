"use client";
import ManageItem from "@/app/tracker/components/ManageItem";
import ManageItemProvider from "@/app/tracker/context/ManageItemProvider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FoodItemType } from "@/types/FoodItem";
import { AllCategory } from "@prisma/client";
import { ReactNode } from "react";
import { useDiet } from "../hook/useDiet";
import useDialog from "@/app/hooks/useDialog";

export default function NewFoodItem({ title, currentCategory, triggerElement }: { title: string, currentCategory: AllCategory[], triggerElement?: ReactNode }) {
    const { newFoodItem } = useDiet();
    const { isAddNewItemToCatDialog, setIsAddNewItemToCatDialog } = useDialog()

    return (
        <Dialog open={isAddNewItemToCatDialog[currentCategory[0]]} onOpenChange={(open) => { setIsAddNewItemToCatDialog({ ...isAddNewItemToCatDialog, [currentCategory[0]]: open }) }}>
            {triggerElement &&
                <DialogTrigger asChild>
                    {triggerElement}
                </DialogTrigger>
            }

            <DialogContent className="sm:max-w-[425px] overflow-y-auto h-5/5">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {
                            <>
                                Add nutrients as <b>Amount Per (g)</b> from verified source
                            </>
                        }
                    </DialogDescription>
                </DialogHeader>
                <ManageItemProvider itemToManage={{ ...newFoodItem, category: currentCategory } as FoodItemType}>
                    <ManageItem isNewItem={true} currentCategory={[...currentCategory]} />
                </ManageItemProvider>
            </DialogContent>
        </Dialog>
    )
}
