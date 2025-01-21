"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { LuCirclePlus } from "react-icons/lu";
// import { useDiet } from "../context/DietProvider";
import { useDiet } from "../hook/useDiet";
import DietTracker from "./DietTracker";
import ManageItem from "./ManageItem";

export default function SubTitle({ label }: { label: string }) {
    return (
        <h2 className="text-xl mr-5 flex items-center gap-3 mt-1 mb-2 ml-1">
            {label}
            <Dialog>
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                <LuCirclePlus size="20px" cursor="pointer" />
                            </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add {label}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Item</DialogTitle>
                        <DialogDescription>
                            Add Item for {label}
                        </DialogDescription>
                    </DialogHeader>
                    <ManageItem isNewItem={true} />
                    <DialogFooter>
                        <Button type="submit">Add Item</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </h2>
    )
}
