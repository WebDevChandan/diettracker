"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useDialog from "@/hook/useDialog";
import { LuCirclePlus } from "react-icons/lu";
import ManageItem from "./ManageItem";

export default function SubTitle({ label }: { label: string }) {
    const { open, setOpen } = useDialog();

    return (
        <h2 className="text-xl mr-5 flex items-center gap-3 mt-1 mb-2 ml-1">
            {label}
            <Dialog open={open} onOpenChange={setOpen}>
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
                        <DialogTitle>Add Item for {label} </DialogTitle>
                        <DialogDescription>
                            Added nutrients should be from verified source
                        </DialogDescription>
                    </DialogHeader>
                    <ManageItem isNewItem={true} />
                </DialogContent>
            </Dialog>
        </h2>
    )
}
