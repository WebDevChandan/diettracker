"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useDialog from "@/hooks/useDialog";
import { AllCategory } from "@prisma/client";
import { LuCirclePlus } from "react-icons/lu";
import ManageItemProvider from "../context/ManageItemProvider";
import ManageItem from "./ManageItem";
import { FoodItemType } from "@/types/FoodItem";
import NewFoodItem from "./NewFoodItem";

export default function SubTitle({ currentCategory }: { currentCategory: AllCategory }) {
    return (
        <h2 className="text-2xl mr-5 flex items-center gap-3 mt-2 mb-2 ml-1 capitalize">
            {currentCategory}
            <NewFoodItem
                currentCategory={currentCategory}
                triggerElement={<LuCirclePlus size="20px" cursor="pointer" />}
                tooltipText={`Add item to ${currentCategory}`}
            />
        </h2>
    )
}
