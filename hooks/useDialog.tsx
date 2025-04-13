import ManageItem from "@/app/components/ManageItem";
import ManageItemProvider from "@/app/context/ManageItemProvider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DialogContext } from "@/context/DialogProvider";
import { FoodItemType } from "@/types/FoodItem";
import { AllCategory } from "@prisma/client";
import { ReactNode, useContext } from "react";

interface ManageItemProps {
    itemToManage: FoodItemType,
    isNewItem: boolean,
}

interface TootTipProps {
    triggerElement: ReactNode,
    tooltipContent: string,
}

interface DialogType extends ManageItemProps, TootTipProps {
    dialogTitle: string,
    dialogDesc: ReactNode,
    currentCategory: AllCategory[]
}
export const FoodItemDialog = ({ dialogTitle, dialogDesc, triggerElement, tooltipContent, currentCategory, itemToManage, isNewItem }: DialogType) => {
   
    return (
        <Dialog defaultOpen={false}>
            {tooltipContent.length
                ? <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                {triggerElement}
                            </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tooltipContent}</p>
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
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>
                        {dialogDesc}
                    </DialogDescription>
                </DialogHeader>
                <ManageItemProvider itemToManage={itemToManage}>
                    <ManageItem isNewItem={isNewItem} currentCategory={[...currentCategory]} />
                </ManageItemProvider>
            </DialogContent>
        </Dialog>
    );
}

export default function useDialog() {
    const { setIsDialogOpen, isDialogOpen, ...context } = useContext(DialogContext);

    if (!context)
        throw new Error("DialogContext not found");

    return {
        setIsDialogOpen,
        isDialogOpen,
        FoodItemDialog,
        ...context,
    };
}
