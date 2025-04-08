"use client"
import { AllCategory } from "@prisma/client";
import { LuCirclePlus } from "react-icons/lu";
import NewFoodItem from "./NewFoodItem";
import { FoodItemDialog } from "@/hooks/useDialog";
import { FoodItemType } from "@/types/FoodItem";

export default function SubTitle({ currentCategory }: { currentCategory: AllCategory }) {
    return (
        <h2 className="text-2xl mr-5 flex items-center gap-3 mt-2 mb-2 ml-1 capitalize">
            {currentCategory}
            <NewFoodItem
                currentCategory={[currentCategory]}
                triggerElement={<LuCirclePlus size="20px" cursor="pointer" />}
                tooltipText={`Add item to ${currentCategory}`}
            />
        </h2>
    )
}
