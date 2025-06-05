"use client"
import useDialog from "@/app/hooks/useDialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AllCategory } from "@prisma/client";
import { LuCirclePlus } from "react-icons/lu";
import NewFoodItem from "./NewFoodItem";

export default function SubTitle({ currentCategory }: { currentCategory: AllCategory }) {
    const { isAddNewItemToCatDialog, setIsAddNewItemToCatDialog } = useDialog();
    
    return (
        <h2 className="text-2xl mr-5 flex items-center gap-3 mt-2 mb-2 ml-1 capitalize">
            {currentCategory}

            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <LuCirclePlus size="20px" cursor="pointer"
                            onClick={() => setIsAddNewItemToCatDialog({ ...isAddNewItemToCatDialog, [currentCategory]: true })}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{`Add item to ${currentCategory}`}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <NewFoodItem
                title={`Add item to ${currentCategory}`}
                currentCategory={[currentCategory]}
            />
        </h2>
    )
}
