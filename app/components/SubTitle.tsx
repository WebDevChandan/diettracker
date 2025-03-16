"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useDialog from "@/hooks/useDialog";
import { AllCategory } from "@prisma/client";
import { LuCirclePlus } from "react-icons/lu";
import ManageItemProvider from "../context/ManageItemProvider";
import ManageItem from "./ManageItem";
import { FoodItemType } from "@/types/FoodItem";

export default function SubTitle({ currentCategory }: { currentCategory: AllCategory }) {
    const { open, setOpen } = useDialog();
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
        <h2 className="text-2xl mr-5 flex items-center gap-3 mt-2 mb-2 ml-1 capitalize">
            {currentCategory}
            <Dialog open={open} onOpenChange={setOpen}>
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                <LuCirclePlus size="20px" cursor="pointer" />
                            </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add {currentCategory}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <DialogContent className="sm:max-w-[425px] overflow-y-auto h-4/5">
                    <DialogHeader>
                        <DialogTitle>Add Item for {currentCategory} </DialogTitle>
                        <DialogDescription>
                            Add nutrients as <b>Amount Per (g)</b> from verified source
                        </DialogDescription>
                    </DialogHeader>
                    <ManageItemProvider itemToManage={newItem} >
                        <ManageItem isNewItem={true} currentCategory={currentCategory} />
                    </ManageItemProvider>
                </DialogContent>
            </Dialog>

            {/* <TooltipProvider delayDuration={200}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <MdDelete size="20px" cursor="pointer" color="#b60a0a" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Remove Selected Item</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> */}
        </h2>
    )
}
