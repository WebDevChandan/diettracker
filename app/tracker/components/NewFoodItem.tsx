"use client";
import ManageItem from "@/app/tracker/components/ManageItem";
import ManageItemProvider from "@/app/tracker/context/ManageItemProvider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FoodItemType } from "@/types/FoodItem";
import { AllCategory } from "@prisma/client";
import { ReactNode } from "react";
import { useDiet } from "../hook/useDiet";

export default function NewFoodItem({ title, currentCategory, triggerElement, tooltipText }: { title: string, currentCategory: AllCategory[], triggerElement: ReactNode, tooltipText: string }) {
    const { newFoodItem } = useDiet();

    return (
        <Dialog defaultOpen={false}>
            {tooltipText.length
                ? <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                {triggerElement}
                            </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tooltipText}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                :
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
